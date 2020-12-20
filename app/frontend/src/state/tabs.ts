import type { Action, AnyAction } from "redux"

import type { RootState, TAB_TYPES } from "./State"


export const tabs_reducer = (state: RootState, action: AnyAction) =>
{

    if (is_select_tab(action))
    {
        if (state.tabs.selected_tab !== action.selected_tab)
        {
            state = {
                ...state,
                tabs: {
                    selected_tab: action.selected_tab
                }
            }
        }
    }

    return state
}


interface ActionSelectTab extends Action {
    selected_tab: TAB_TYPES
}

const select_tab_type = "select_tab"

export const select_tab = (selected_tab: TAB_TYPES): ActionSelectTab =>
{
    return { type: select_tab_type, selected_tab }
}

const is_select_tab = (action: AnyAction): action is ActionSelectTab => {
    return action.type === select_tab_type
}


export const tab_actions = {
    select_tab,
}
