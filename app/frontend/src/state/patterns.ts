import type { Action, AnyAction } from "redux"

import { get_datetime, get_new_pattern_id } from "../utils/utils"
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

    if (is_replace_all_patterns(action))
    {
        state = {
            ...state,
            patterns: action.patterns
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
const add_pattern = (args: AddPatternArgs): ActionAddPattern =>
{
    const id = get_new_pattern_id()
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

const delete_pattern = (id: string): ActionDeletePattern =>
{
    return { type: delete_pattern_type, id }
}

const is_delete_pattern = (action: AnyAction): action is ActionDeletePattern => {
    return action.type === delete_pattern_type
}


//

interface ActionReplaceAllPatterns extends Action {
    patterns: Pattern[]
}

const replace_all_patterns_type = "replace_all_patterns"


interface ReplaceAllPatternsProps
{
    patterns: Pattern[]
}
const replace_all_patterns = (args: ReplaceAllPatternsProps): ActionReplaceAllPatterns =>
{
    return {
        type: replace_all_patterns_type,
        patterns: args.patterns,
    }
}

const is_replace_all_patterns = (action: AnyAction): action is ActionReplaceAllPatterns => {
    return action.type === replace_all_patterns_type
}


//

export const pattern_actions = {
    add_pattern,
    delete_pattern,
    replace_all_patterns,
}
