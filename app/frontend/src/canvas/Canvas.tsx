import { h } from "preact"
import { useState } from "preact/hooks"

import "./Canvas.css"
import type { ProjectPriorityNodeProps, DailyActionNodeProps } from "./interfaces"
import { bounded } from "../utils/utils"
import { ProjectPriorityNode } from "../planning/project_priorities/ProjectPriorityNode"
import { DailyActionNode } from "../planning/daily_actions/DailyActionNode"
import { CurrentDatetimeLine } from "../planning/CurrentDatetimeLine"
import type { ExtendOfContent } from "../planning/project_priorities/project_priorities_to_nodes"


interface OwnProps
{
    project_priority_node_props: ProjectPriorityNodeProps[]
    daily_action_node_props: DailyActionNodeProps[]
    origin_ms: number
    extent_of_content: ExtendOfContent
    set_action_ids_to_show: (action_ids: string[]) => void
}


type PointerState =
{
    down: false
    start_x: null
    start_y: null
    canvas_start_x: null
    canvas_start_y: null
} | {
    down: true
    start_x: number
    start_y: number
    canvas_start_x: number
    canvas_start_y: number
}
const pointer_state: PointerState = {
    down: false,
    start_x: null,
    start_y: null,
    canvas_start_x: null,
    canvas_start_y: null,
}


export function Canvas (props: OwnProps)
{
    const [x, change_x] = useState(0)
    const [y, change_y] = useState(0)
    const [scale, _change_scale] = useState(1)
    const bound_scale = (new_scale: number) => bounded(new_scale, 0.1, 4)
    function change_scale (new_scale: number) { _change_scale(bound_scale(new_scale)) }

    function on_pointer_down (e: h.JSX.TargetedEvent<HTMLDivElement, MouseEvent>) {
        pointer_state.down = true
        pointer_state.start_x = e.clientX
        pointer_state.start_y = e.clientY
        pointer_state.canvas_start_x = x
        pointer_state.canvas_start_y = y
    }
    function on_pointer_up () { pointer_state.down = false }

    function on_pointer_move (e: h.JSX.TargetedEvent<HTMLDivElement, MouseEvent>)
    {
        if (pointer_state.down)
        {
            change_x(pointer_state.canvas_start_x + e.clientX - pointer_state.start_x)
            change_y(pointer_state.canvas_start_y + e.clientY - pointer_state.start_y)
        }
    }

    function on_wheel (e: h.JSX.TargetedEvent<HTMLDivElement, WheelEvent>)
    {
        e.stopPropagation()

        const old_scale = scale
        const new_scale = bound_scale(scale + (e.deltaY * -0.01 * scale))
        if (new_scale === old_scale) return

        const bounding_rect = e.currentTarget.getBoundingClientRect()
        const client_width = bounding_rect.width
        const client_height = bounding_rect.height
        const width_diff = client_width * new_scale - client_width * old_scale
        const height_diff = client_height * new_scale - client_height * old_scale
        const client_x = e.clientX - bounding_rect.left
        const client_y = e.clientY - bounding_rect.top

        const x_factor = ((client_x - x) / old_scale) / client_width
        const y_factor = ((client_y - y) / old_scale) / client_height

        change_scale(new_scale)
        change_x(x - width_diff * x_factor)
        change_y(y - height_diff * y_factor)
    }

    const background_style = {
        backgroundPosition: `${x}px ${y}px`,
        backgroundSize: `${20 * scale}px ${20 * scale}px`,
    }
    const html_container_style = {
        transform: `translate(${x}px,${y}px) scale(${scale})`
    }

    return (
    <div
        id="graph_container"
        style={background_style}
        onPointerDown={on_pointer_down}
        onPointerMove={on_pointer_move}
        onPointerUp={on_pointer_up}
        onWheel={on_wheel}
    >
        <div id="graph_visuals_container" style={html_container_style}>
            {props.project_priority_node_props.map(node_props => <ProjectPriorityNode {...node_props} />)}
            {props.daily_action_node_props.map(node_props => <DailyActionNode {...node_props} set_action_ids_to_show={props.set_action_ids_to_show} />)}

            <svg
                width="900"
                height="600"
            >
                <g>
                    <CurrentDatetimeLine
                        extent_of_content={props.extent_of_content}
                        origin_ms={props.origin_ms}
                    />
                </g>
            </svg>
        </div>

    </div>
    )
}