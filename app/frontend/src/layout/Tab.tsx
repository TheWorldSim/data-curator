import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { ACTIONS } from "../state/store"
import type { RootState, ROUTE_TYPES } from "../state/State"
import "./Tab.css"


function get_title (id: ROUTE_TYPES)
{
    if (id === "statements") return "Statements"
    else if (id === "desired_states") return "Desired States"
    else return "?"
}


const map_state = (state: RootState) => ({
    route: state.routing.route
})


const map_dispatch = {
    change_route: (id: ROUTE_TYPES) => ACTIONS.change_route(id)
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    id: ROUTE_TYPES
}


function _Tab (props: Props)
{
    const title = get_title(props.id)
    const css_class = "tab " + (props.route === props.id ? "selected" : "")

    return <div class={css_class} onClick={() => props.change_route(props.id)}>
        {title}
    </div>
}


export const Tab = connector(_Tab)
