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
    link_clicked: () => dispatch(ACTIONS.change_route({
        route: own_props.route, sub_route: undefined, item_id: own_props.item_id
    }))
})


const connector = connect(null, map_dispatch)
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
        const on_click = (e: h.JSX.TargetedEvent<HTMLAnchorElement, MouseEvent>) => {
            this.setState({ clicked: true })

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
            className={"link " + (this.state.clicked ? "clicked_animate" : "")}
        >
            {this.props.children}
        </a>
    }
}


export const Link = connector(_Link) as ComponentClass<OwnProps>
