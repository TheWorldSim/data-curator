import type { Action, AnyAction, Store } from "redux"

import type { RootState } from "./State"


export const current_datetime_reducer = (state: RootState, action: AnyAction): RootState =>
{
    if (is_update_current_datetime(action))
    {
        state = {
            ...state,
            current_datetime: {
                dt: action.current_datetime
            },
        }
    }

    return state
}


//

interface ActionUpdateCurrentDatetime extends Action {
    current_datetime: Date
}

const update_current_datetime_type = "update_current_datetime"


interface UpdateCurrentDatetimeProps
{
    current_datetime: Date
}
const update_current_datetime = (args: UpdateCurrentDatetimeProps): ActionUpdateCurrentDatetime =>
{
    return {
        type: update_current_datetime_type,
        current_datetime: args.current_datetime,
    }
}

const is_update_current_datetime = (action: AnyAction): action is ActionUpdateCurrentDatetime => {
    return action.type === update_current_datetime_type
}


export const current_datetime_actions = {
    update_current_datetime,
}


//

export function periodically_update_current_datetime (store: Store<RootState>)
{
    setTimeout(() => {
        store.dispatch(update_current_datetime({ current_datetime: new Date() }))
    }, 3600000)
}
