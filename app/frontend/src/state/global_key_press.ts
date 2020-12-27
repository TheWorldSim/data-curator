import type { Action, AnyAction } from "redux"

import type { RootState } from "./State"


export const global_key_press_reducer = (state: RootState, action: AnyAction): RootState =>
{

    if (is_key_down(action))
    {
        state = {
            ...state,
            global_key_press: {
                last_key: action.key,
                last_key_time_stamp: action.time_stamp,
            }
        }
    }

    return state
}


export interface ActionKeyDownArgs
{
    time_stamp: number
    alt_key: boolean
    code: string
    ctrl_key: boolean
    key: string
    meta_key: boolean
    return_value: boolean
    shift_key: boolean
}


interface ActionKeyDown extends Action, ActionKeyDownArgs {}

const key_down_type = "key_down"

export const key_down = (global_key_press_args: ActionKeyDownArgs): ActionKeyDown =>
{
    return { type: key_down_type, ...global_key_press_args }
}

const is_key_down = (action: AnyAction): action is ActionKeyDown => {
    return action.type === key_down_type
}


export const global_key_press_actions = {
    key_down,
}
