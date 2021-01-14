import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { x_factory } from "./display"
import type { ExtendOfContent } from "./project_priorities/project_priorities_to_nodes"


interface OwnProps
{
    extent_of_content: ExtendOfContent
    origin_ms: number
}


const map_state = (state: RootState) =>
{
    return {
        current_datetime: state.current_datetime.dt
    }
}


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps


function _CurrentDatetimeLine (props: Props)
{
    const x = x_factory(props.origin_ms)(props.current_datetime.getTime())

    return <line
        x1={x}
        y1="0"
        x2={x}
        y2={props.extent_of_content.max_y}
        stroke="red"
        strokeWidth="2"
    /> //<div>{props.current_datetime.toISOString()}</div>
}


export const CurrentDatetimeLine = connector(_CurrentDatetimeLine) as FunctionalComponent<OwnProps>
