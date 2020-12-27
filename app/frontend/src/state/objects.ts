import type { Action, AnyAction } from "redux"

import { get_datetime, get_new_id } from "../utils/utils"
import type { RootState, Objekt, ObjectAttribute } from "./State"


export const objects_reducer = (state: RootState, action: AnyAction): RootState =>
{
    if (is_add_object(action))
    {
        const new_object: Objekt = {
            id: action.id,
            datetime_created: action.datetime_created,
            pattern_id: action.pattern_id,
            content: action.content,
            attributes: action.attributes,
            labels: [],
        }

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

    return state
}


//

interface ActionAddObject extends Action, Objekt {}

const add_object_type = "add_object"


interface AddObjectProps
{
    pattern_id: string
    content: string
    attributes: ObjectAttribute[]
}
export const add_object = (args: AddObjectProps): ActionAddObject =>
{
    const datetime_created = get_datetime()
    const id = get_new_id()

    return {
        type: add_object_type,
        id,
        datetime_created,
        pattern_id: args.pattern_id,
        content: args.content,
        attributes: args.attributes,
        labels: [],
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


export const object_actions = {
    add_object,
    delete_object,
}
