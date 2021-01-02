import type { Action, AnyAction } from "redux"
import { replace_element } from "../utils/list"

import { get_datetime, get_new_id } from "../utils/utils"
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
    if (is_add_object(action))
    {
        const new_object: ObjectWithCache = { ...action }
        delete (new_object as any).type

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
    }

    if (is_update_object(action))
    {
        const object_exists = !!state.objects.find(({ id }) => id === action.id)

        if (!object_exists)
        {
            console.error(`No object for id: "${action.id}"`)
            return state
        }

        const replacement_object: ObjectWithCache = { ...action }
        delete (replacement_object as any).type
        let objects = replace_element(state.objects, replacement_object, ({ id }) => id === action.id)

        state = {
            ...state,
            objects,
        }
    }

    if (is_add_object(action) || is_delete_object(action) || is_update_object(action))
    {
        // bust the cache
        state = {
            ...state,
            objects: state.objects.map(o => ({ ...o, rendered: "", needs_rendering: true })),
        }
    }

    if (is_replace_all_objects(action))
    {
        state = {
            ...state,
            objects: action.objects,
        }
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
        action.objects.forEach(o => {
            if (existing_ids.has(o.id)) object_ids_to_update[o.id] = o
            else objects_to_insert.push(o)
        })

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

    return state
}


//

interface ActionAddObject extends Action, ObjectWithCache {}

const add_object_type = "add_object"


export interface AddObjectProps
{
    pattern_id: string
    pattern_name: string
    content: string

    attributes: ObjectAttribute[]
    labels: string[]
    external_ids: { [application: string]: string },
}
export const add_object = (args: AddObjectProps): ActionAddObject =>
{
    const datetime_created = get_datetime()
    const id = "o" + get_new_id()

    return {
        type: add_object_type,
        id,
        datetime_created,
        pattern_id: args.pattern_id,
        pattern_name: args.pattern_name,
        content: args.content,
        attributes: args.attributes,
        labels: args.labels,
        external_ids: args.external_ids,

        rendered: "",
        needs_rendering: true,
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

export const delete_object = (id: string): ActionDeleteObject =>
{
    return { type: delete_object_type, id }
}

const is_delete_object = (action: AnyAction): action is ActionDeleteObject => {
    return action.type === delete_object_type
}


//

interface ActionUpdateObject extends Action, ObjectWithCache {}

const update_object_type = "update_object"


export interface UpdateObjectProps extends Objekt {}
// {
//     id: string
//     datetime_created: Date
//     pattern_id: string
//     pattern_name: string
//     content: string

//     attributes: ObjectAttribute[]
//     labels: string[]
//     external_ids: { [application: string]: string }
// }
export const update_object = (args: UpdateObjectProps): ActionUpdateObject =>
{
    return {
        type: update_object_type,
        id: args.id,
        datetime_created: args.datetime_created,
        pattern_id: args.pattern_id,
        pattern_name: args.pattern_name,
        content: args.content,
        attributes: args.attributes,
        labels: args.labels,
        external_ids: args.external_ids,

        rendered: "",
        needs_rendering: true,
    }
}

const is_update_object = (action: AnyAction): action is ActionUpdateObject => {
    return action.type === update_object_type
}


//

interface ActionUpsertObjects extends Action {
    objects: ObjectWithCache[]
}

const upsert_objects_type = "upsert_objects"


export interface UpsertObjectsProps
{
    objects: ObjectWithCache[]
}
export const upsert_objects = (args: UpsertObjectsProps): ActionUpsertObjects =>
{
    return {
        type: upsert_objects_type,
        objects: args.objects.map(o => ({
            ...o,
            rendered: "",
            needs_rendering: true,
        })),
    }
}

const is_upsert_objects = (action: AnyAction): action is ActionUpsertObjects => {
    return action.type === upsert_objects_type
}


//

interface ActionReplaceAllObjects extends Action {
    objects: ObjectWithCache[]
}

const replace_all_objects_type = "replace_all_objects"


export interface UpdateObjectsProps
{
    objects: ObjectWithCache[]
}
export const replace_all_objects = (args: UpdateObjectsProps): ActionReplaceAllObjects =>
{
    return {
        type: replace_all_objects_type,
        objects: args.objects,
    }
}

const is_replace_all_objects = (action: AnyAction): action is ActionReplaceAllObjects => {
    return action.type === replace_all_objects_type
}


//

export const object_actions = {
    add_object,
    delete_object,
    update_object,
    upsert_objects,
    replace_all_objects,
}


export function convert_from_pattern_attributes (attributes: PatternAttribute[]): ObjectAttribute[]
{
    return attributes.map((a, pidx) => ({ pidx, value: "", pattern: a }))
}


function merge_pattern_attributes (attributes: CoreObjectAttribute[], pattern: Pattern): ObjectAttribute[]
{
    return attributes.map((a, i) => ({ ...a, pattern: pattern.attributes[i] }))
}

export function merge_pattern (object: CoreObject, patterns: Pattern[]): Objekt
{
    const pattern = patterns.find(({ id }) => id === object.pattern_id)

    if (!pattern) throw new Error(`No pattern id: "${object.pattern_id}" in patterns`)

    return {
        ...object,
        pattern_id: pattern.id,
        pattern_name: pattern.name,
        content: pattern.content,
        attributes: merge_pattern_attributes(object.attributes, pattern)
    }
}
