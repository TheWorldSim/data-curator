import type { Action, AnyAction } from "redux"

import { get_datetime, get_new_id } from "../utils"
import type { RootState, Pattern, PatternAttribute } from "./State"


export const patterns_reducer = (state: RootState, action: AnyAction): RootState =>
{
    if (is_add_pattern(action))
    {
        const new_pattern: Pattern = {
            id: action.id,
            datetime_created: action.datetime_created,
            name: action.name,
            content: action.content,
            attributes: action.attributes,
        }

        state = {
            ...state,
            patterns: [...state.patterns, new_pattern]
        }
    }

    if (is_delete_pattern(action))
    {
        state = {
            ...state,
            patterns: state.patterns.filter(({ id }) => id !== action.id)
        }
    }

    return state
}


//

interface ActionAddPattern extends Action, Pattern {}

const add_pattern_type = "add_pattern"


interface AddPatternArgs
{
    name: string
    content: string
    attributes: PatternAttribute[]
}
export const add_pattern = (args: AddPatternArgs): ActionAddPattern =>
{
    const id = get_new_id()
    const datetime_created = get_datetime()

    return {
        type: add_pattern_type,
        id,
        datetime_created,
        name: args.name,
        content: args.content,
        attributes: args.attributes,
    }
}

const is_add_pattern = (action: AnyAction): action is ActionAddPattern => {
    return action.type === add_pattern_type
}


//

interface ActionDeletePattern extends Action {
    id: string
}

const delete_pattern_type = "delete_pattern"

export const delete_pattern = (id: string): ActionDeletePattern =>
{
    return { type: delete_pattern_type, id }
}

const is_delete_pattern = (action: AnyAction): action is ActionDeletePattern => {
    return action.type === delete_pattern_type
}


export const pattern_actions = {
    add_pattern,
    delete_pattern,
}
