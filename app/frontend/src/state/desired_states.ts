import type { Action, AnyAction } from "redux"

import { get_datetime, get_new_id } from "../utils"
import type { RootState, DesiredState } from "./State"


export const desired_states_reducer = (state: RootState, action: AnyAction) =>
{
    if (is_add_desired_state(action))
    {
        const new_desired_state = {
            id: action.id,
            content: action.content,
            datetime_created: action.datetime_created,
        }

        state = {
            ...state,
            desired_states: [...state.desired_states, new_desired_state]
        }
    }

    if (is_delete_desired_state(action))
    {
        state = {
            ...state,
            desired_states: state.desired_states.filter(({ id }) => id !== action.id)
        }
    }

    return state
}


interface ActionAddDesiredState extends Action, DesiredState {}

const add_desired_state_type = "add_desired_state"

export const add_desired_state = (args: { content: string }): ActionAddDesiredState =>
{
    const datetime_created = get_datetime()
    const id = get_new_id()

    return { type: add_desired_state_type, content: args.content, datetime_created, id }
}

const is_add_desired_state = (action: AnyAction): action is ActionAddDesiredState => {
    return action.type === add_desired_state_type
}


interface ActionDeleteDesiredState extends Action {
    id: string
}

const delete_desired_state_type = "delete_desired_state"

export const delete_desired_state = (id: string): ActionDeleteDesiredState =>
{
    return { type: delete_desired_state_type, id }
}

const is_delete_desired_state = (action: AnyAction): action is ActionDeleteDesiredState => {
    return action.type === delete_desired_state_type
}


export const desired_state_actions = {
    add_desired_state,
    delete_desired_state,
}
