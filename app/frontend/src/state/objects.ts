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

    if (is_update_objects(action))
    {
        state = {
            ...state,
            objects: action.objects,
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


export interface UpdateObjectProps
{
    id: string
    datetime_created: Date
    pattern_id: string
    pattern_name: string
    content: string

    attributes: ObjectAttribute[]
    labels: string[]
    external_ids: { [application: string]: string }
}
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

interface ActionUpdateObjects extends Action {
    objects: ObjectWithCache[]
}

const update_objects_type = "update_objects"


export interface UpdateObjectsProps
{
    objects: ObjectWithCache[]
}
export const update_objects = (args: UpdateObjectsProps): ActionUpdateObjects =>
{
    return {
        type: update_objects_type,
        objects: args.objects,
    }
}

const is_update_objects = (action: AnyAction): action is ActionUpdateObjects => {
    return action.type === update_objects_type
}


//

export const object_actions = {
    add_object,
    delete_object,
    update_object,
    update_objects,
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
