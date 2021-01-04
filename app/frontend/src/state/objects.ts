import type { Action, AnyAction } from "redux"
import { replace_element } from "../utils/list"

import { get_datetime, get_new_object_id } from "../utils/utils"
import { is_update_pattern } from "./pattern_actions"
import type {
    RootState,
    Objekt,
    ObjectAttribute,
    PatternAttribute,
    Pattern,
    CoreObjectAttribute,
    CoreObject,
    ObjectWithCache,
} from "./State"


export const objects_reducer = (state: RootState, action: AnyAction): RootState =>
{
    let bust_object_render_caches = false

    if (is_add_object(action))
    {
        const new_object = action_to_object_with_cache(action, state.patterns)
        bust_object_render_caches = true

        state = {
            ...state,
            objects: [...state.objects, new_object]
        }
    }


    if (is_delete_object(action))
    {
        state = {
            ...state,
            objects: state.objects.filter(({ id }) => id !== action.id)
        }
        bust_object_render_caches = true
    }


    if (is_update_object(action))
    {
        const object_exists = !!state.objects.find(({ id }) => id === action.id)

        if (!object_exists)
        {
            console.error(`No object for id: "${action.id}"`)
            return state
        }

        const replacement_object = action_to_object_with_cache(action, state.patterns)
        bust_object_render_caches = true

        const objects = replace_element(state.objects, replacement_object, ({ id }) => id === action.id)

        state = {
            ...state,
            objects,
        }
    }


    if (is_replace_all_core_objects(action))
    {
        const new_objects: ObjectWithCache[] = []
        action.objects.forEach(core_object => {
            const new_object = add_cache(merge_pattern_into_core_object({
                object: core_object,
                patterns: state.patterns,
            }))
            new_objects.push(new_object)
        })
        // `add_cache` function already set all objects to have id_rendered: false
        // bust_object_render_caches = true

        state = {
            ...state,
            objects: new_objects,
        }
    }


    if (is_replace_all_objects_with_cache(action))
    {
        state = {
            ...state,
            objects: action.objects,
        }
        // For now `is_replace_all_objects_with_cache` is how we set the rendered
        // value of all objects So we can not bust the cache here
        bust_object_render_caches = false
    }


    if (is_upsert_objects(action))
    {
        const existing_ids: Set<string> = new Set()
        state.objects.forEach(o => {
            if (existing_ids.has(o.id)) console.error(`Duplicate objects found for id: ${o.id}`)
            existing_ids.add(o.id)
        })

        const object_ids_to_update: {[id: string]: ObjectWithCache} = {}
        const objects_to_insert: ObjectWithCache[] = []

        action.objects.forEach(core_object => {
            const new_object = add_cache(merge_pattern_into_core_object({
                object: core_object,
                patterns: state.patterns,
            }))

            if (existing_ids.has(new_object.id)) object_ids_to_update[new_object.id] = new_object
            else objects_to_insert.push(new_object)
        })
        bust_object_render_caches = true

        const objects: ObjectWithCache[] = state.objects.map(o => {
            if (object_ids_to_update.hasOwnProperty(o.id))
            {
                o = {
                    ...o,
                    ...object_ids_to_update[o.id],
                }
            }

            return o
        }).concat(objects_to_insert)

        state = {
            ...state,
            objects,
        }
    }


    if (is_update_pattern(action))
    {
        bust_object_render_caches = true
    }


    if (bust_object_render_caches)
    {
        // bust the cache
        state = {
            ...state,
            objects: state.objects.map(o => {
                const object: ObjectWithCache = {
                    ...o,
                    rendered: "",
                    is_rendered: false,
                }
                return object
            })
        }
    }


    return state
}


//

interface ActionAddObject extends Action, CoreObject {}

const add_object_type = "add_object"


export interface AddObjectProps
{
    pattern_id: string

    attributes: CoreObjectAttribute[]
    labels: string[]
    external_ids: { [application: string]: string },
}
const add_object = (args: AddObjectProps): ActionAddObject =>
{
    const datetime_created = get_datetime()
    const id = get_new_object_id()

    return {
        type: add_object_type,
        id,
        datetime_created,
        pattern_id: args.pattern_id,
        attributes: args.attributes,
        labels: args.labels,
        external_ids: args.external_ids,
    }
}

const is_add_object = (action: AnyAction): action is ActionAddObject => {
    return action.type === add_object_type
}


//

interface ActionDeleteObject extends Action {
    id: string
}

const delete_object_type = "delete_object"

const delete_object = (id: string): ActionDeleteObject =>
{
    return { type: delete_object_type, id }
}

const is_delete_object = (action: AnyAction): action is ActionDeleteObject => {
    return action.type === delete_object_type
}


//

interface ActionUpdateObject extends Action, CoreObject {}

const update_object_type = "update_object"


export interface UpdateObjectProps extends CoreObject {}
const update_object = (args: UpdateObjectProps): ActionUpdateObject =>
{
    return {
        type: update_object_type,
        id: args.id,
        datetime_created: args.datetime_created,
        pattern_id: args.pattern_id,
        attributes: args.attributes,
        labels: args.labels,
        external_ids: args.external_ids,
    }
}

const is_update_object = (action: AnyAction): action is ActionUpdateObject => {
    return action.type === update_object_type
}


//

interface ActionUpsertObjects extends Action {
    objects: CoreObject[]
}

const upsert_objects_type = "upsert_objects"


interface UpsertObjectsProps
{
    objects: CoreObject[]
}
const upsert_objects = (args: UpsertObjectsProps): ActionUpsertObjects =>
{
    return {
        type: upsert_objects_type,
        objects: args.objects.map(o => ({
            ...o,
            id: o.id || get_new_object_id(),
        })),
    }
}

const is_upsert_objects = (action: AnyAction): action is ActionUpsertObjects => {
    return action.type === upsert_objects_type
}


//

interface ActionReplaceAllCoreObjects extends Action {
    objects: CoreObject[]
}

const replace_all_core_objects_type = "replace_all_core_objects"


interface ReplaceAllCoreObjectsProps
{
    objects: CoreObject[]
}
const replace_all_core_objects = (args: ReplaceAllCoreObjectsProps): ActionReplaceAllCoreObjects =>
{
    return {
        type: replace_all_core_objects_type,
        objects: args.objects,
    }
}

const is_replace_all_core_objects = (action: AnyAction): action is ActionReplaceAllCoreObjects => {
    return action.type === replace_all_core_objects_type
}


//

interface ActionReplaceAllObjectsWithCache extends Action {
    objects: ObjectWithCache[]
}

const replace_all_objects_with_cache_type = "replace_all_objects_with_cache"


interface ReplaceAllObjectsWithCacheProps
{
    objects: ObjectWithCache[]
}
const replace_all_objects_with_cache = (args: ReplaceAllObjectsWithCacheProps): ActionReplaceAllObjectsWithCache =>
{
    return {
        type: replace_all_objects_with_cache_type,
        objects: args.objects,
    }
}

const is_replace_all_objects_with_cache = (action: AnyAction): action is ActionReplaceAllObjectsWithCache => {
    return action.type === replace_all_objects_with_cache_type
}


//

export const object_actions = {
    add_object,
    delete_object,
    update_object,
    upsert_objects,
    replace_all_core_objects,
    replace_all_objects_with_cache,
}


export function convert_from_pattern_attributes (attributes: PatternAttribute[]): ObjectAttribute[]
{
    return attributes.map((a, pidx) => ({ pidx, value: "", pattern: a }))
}


export function merge_pattern_attributes (attributes: CoreObjectAttribute[], pattern: Pattern): ObjectAttribute[]
{
    return attributes.map(a => ({ ...a, pattern: pattern.attributes[a.pidx] }))
}


type MergePatternIntoCoreObjectArgs =
{
    object: CoreObject
    patterns: Pattern[]
} | {
    object: CoreObject
    pattern: Pattern
}
export function merge_pattern_into_core_object (args: MergePatternIntoCoreObjectArgs): Objekt
{
    const pattern: Pattern = args.hasOwnProperty("pattern")
        ? (args as any).pattern
        : find_pattern((args as any).patterns, args.object.pattern_id)

    return {
        ...args.object,
        pattern_id: pattern.id,
        pattern_name: pattern.name,
        content: pattern.content,
        attributes: merge_pattern_attributes(args.object.attributes, pattern)
    }
}

function find_pattern (patterns: Pattern[], pattern_id: string)
{
    const pattern = patterns.find(({ id }) => id === pattern_id)

    if (!pattern) throw new Error(`No pattern id: "${pattern_id}" in patterns`)

    return pattern
}


function add_cache (object: Objekt): ObjectWithCache
{
    return {
        ...object,
        rendered: "",
        is_rendered: false,
    }
}


function action_to_object_with_cache (action: CoreObject & Action, patterns: Pattern[]): ObjectWithCache
{
    const core_object: CoreObject = { ...action }
    delete (core_object as any).type
    const object: ObjectWithCache = add_cache(merge_pattern_into_core_object({
        object: core_object,
        patterns: patterns,
    }))

    return object
}
