import { Component, ComponentClass, h } from "preact"
import type { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

import "./Link.css"
import { get_route } from "../state/routing"
import type { ROUTE_TYPES } from "../state/State"
import { ACTIONS } from "../state/store"


interface OwnProps {
    route: ROUTE_TYPES
    item_id?: string
    on_click?: () => void
}


const map_dispatch = (dispatch: Dispatch, own_props: OwnProps) => ({
    link_clicked: () => dispatch(ACTIONS.change_route({ route: own_props.route, item_id: own_props.item_id }))
})


const connector = connect(null, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


class _Link extends Component<Props>
{
    render () {
        const on_click = (e: h.JSX.TargetedEvent<HTMLAnchorElement, MouseEvent>) => {
            if (this.props.on_click)
            {
                e.preventDefault()
                this.props.on_click()
            }
            else
            {
                this.props.link_clicked()
            }
        }

        return <a
            onClick={on_click}
            href={get_route(this.props)}
        >
            {this.props.children}
        </a>
    }
}


export const Link = connector(_Link) as ComponentClass<OwnProps>
