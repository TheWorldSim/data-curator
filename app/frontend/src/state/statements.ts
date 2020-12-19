import type { Action, AnyAction } from "redux"

import { get_datetime, get_new_id } from "../utils"
import type { RootState, Statement } from "./State"


export const statements_reducer = (state: RootState, action: AnyAction) =>
{
    if (is_add_statement(action))
    {
        const new_statement = {
            id: action.id,
            content: action.content,
            datetime_created: action.datetime_created,
        }

        state = {
            ...state,
            statements: [...state.statements, new_statement]
        }
    }

    if (is_delete_statement(action))
    {
        state = {
            ...state,
            statements: state.statements.filter(({ id }) => id !== action.id)
        }
    }

    return state
}


interface ActionAddStatement extends Action, Statement {}

const add_statement_type = "add_statement"

export const add_statement = (args: { content: string }): ActionAddStatement =>
{
    const datetime_created = get_datetime()
    const id = get_new_id()

    return { type: add_statement_type, content: args.content, datetime_created, id }
}

const is_add_statement = (action: AnyAction): action is ActionAddStatement => {
    return action.type === add_statement_type
}


interface ActionDeleteStatement extends Action {
    id: string
}

const delete_statement_type = "delete_statement"

export const delete_statement = (id: string): ActionDeleteStatement =>
{
    return { type: delete_statement_type, id }
}

const is_delete_statement = (action: AnyAction): action is ActionDeleteStatement => {
    return action.type === delete_statement_type
}


export const statement_actions = {
    add_statement,
    delete_statement,
}
