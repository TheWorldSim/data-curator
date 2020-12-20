import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { ACTIONS } from "../state/store"
import type { RootState, TAB_TYPES } from "../state/State"
import "./Tab.css"


function get_title (id: TAB_TYPES)
{
    if (id === "statements") return "Statements"
    else if (id === "desired_states") return "Desired States"
    else return "?"
}


const map_state = (state: RootState) => ({
    selected_tab: state.tabs.selected_tab
})


const map_dispatch = {
    select_tab: (id: TAB_TYPES) => ACTIONS.select_tab(id)
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    id: TAB_TYPES
}


function _Tab (props: Props)
{
    const title = get_title(props.id)
    const css_class = "tab " + (props.selected_tab === props.id ? "selected" : "")

    return <div class={css_class} onClick={() => props.select_tab(props.id)}>
        {title}
    </div>
}


export const Tab = connector(_Tab)
