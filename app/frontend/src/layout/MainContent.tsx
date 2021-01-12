import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { Canvas } from "../canvas/Canvas"
import { convert_priorities_to_nodes } from "../planning/convert_priorities_to_nodes"
import { get_priorities } from "../planning/get_priorities"
import { routing_args_to_datetime_ms } from "../state/routing/routing_datetime"
import type { RootState } from "../state/State"


interface OwnProps {}


const SCALE = 10
const map_state = (state: RootState) => {
    const display_at_datetime_ms = routing_args_to_datetime_ms(state)

    const priorities = get_priorities(state)

    return {
        route: state.routing.route,
        nodes: convert_priorities_to_nodes({ priorities, display_at_datetime_ms, scale: SCALE }),
    }
}


const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _MainContent (props: Props)
{
    return <div>
        <Canvas nodes={props.nodes} />
    </div>
}


export const MainContent = connector(_MainContent) as FunctionComponent<OwnProps>
