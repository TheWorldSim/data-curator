import { Component, ComponentClass, h } from "preact"
import type { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

import "./Link.css"
import { merge_routing_state, routing_state_to_string } from "../state/routing"
import type { RootState, ROUTE_TYPES, RoutingArgs, RoutingState, SUB_ROUTE_TYPES } from "../state/State"
import { ACTIONS } from "../state/store"


interface OwnProps {
    route: ROUTE_TYPES | undefined
    sub_route: SUB_ROUTE_TYPES | undefined
    item_id: string | null | undefined
    args: RoutingArgs | undefined
    on_click?: () => void
}


const map_state = (state: RootState) =>
{
    return {
        current_routing_state: state.routing,
    }
}


const map_dispatch = (dispatch: Dispatch, own_props: OwnProps) => ({
    link_clicked: (routing_args: RoutingArgs) => dispatch(ACTIONS.change_route({
        route:     own_props.route,
        sub_route: own_props.sub_route,
        item_id:   own_props.item_id,
        args:      routing_args,
    }))
})


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps

interface State { clicked: boolean }


class _Link extends Component<Props, State>
{
    constructor (props: Props)
    {
        super(props)
        this.state = { clicked: false }
    }

    private remove_clicked_class: NodeJS.Timeout | undefined
    componentWillUpdate (new_props: Props, new_state: State)
    {

        if (new_state.clicked && !this.remove_clicked_class)
        {

            this.remove_clicked_class = setTimeout(() => {

                this.setState({ clicked: false })
                this.remove_clicked_class = undefined

            }, 300)
        }
    }

    render () {
        const partial_routing_args = this.props.args || {}

        const on_click = (e: h.JSX.TargetedEvent<HTMLAnchorElement, MouseEvent>) => {
            this.setState({ clicked: true })

            if (this.props.on_click)
            {
                e.preventDefault()
                this.props.on_click()
            }
            else
            {
                this.props.link_clicked(partial_routing_args)
            }
        }

        const full_routing_state = merge_routing_state(this.props.current_routing_state, this.props)
        const full_routing_args = { ...this.props.current_routing_state.args, ...partial_routing_args }
        full_routing_state.args = full_routing_args

        return <a
            onClick={on_click}
            href={routing_state_to_string({ ...full_routing_state })}
            className={"link " + (this.state.clicked ? "clicked_animate" : "")}
        >
            {this.props.children}
        </a>
    }
}


export const Link = connector(_Link) as ComponentClass<OwnProps>
