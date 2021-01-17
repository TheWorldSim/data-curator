import { Component, FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import "./Canvas.css"
import type { ProjectPriorityNodeProps, DailyActionNodeProps } from "./interfaces"
import { bounded } from "../utils/utils"
import { ProjectPriorityNode } from "../planning/project_priorities/ProjectPriorityNode"
import { DailyActionNode } from "../planning/daily_actions/DailyActionNode"
import { CurrentDatetimeLine } from "../planning/CurrentDatetimeLine"
import type { ExtendOfContent } from "../planning/project_priorities/project_priorities_to_nodes"
import type { RootState } from "../state/State"
import { ACTIONS } from "../state/actions"


interface OwnProps
{
    project_priority_node_props: ProjectPriorityNodeProps[]
    daily_action_node_props: DailyActionNodeProps[]
    origin_ms: number
    extent_of_content: ExtendOfContent
    set_action_ids_to_show: (action_ids: string[]) => void
}


const map_state = (state: RootState) => ({
    zoom: parseInt(state.routing.args.zoom, 10),
    x: parseInt(state.routing.args.x, 10),
    y: parseInt(state.routing.args.y, 10),
})


interface ChangeRoutingArgsArgs { x?: number, y?: number, zoom?: number }
interface ChangeRoutingArgs { (args: ChangeRoutingArgsArgs): void }
const map_dispatch = {
    change_routing_args: (args: ChangeRoutingArgsArgs) => {
        const str_args: { x?: string, y?: string, zoom?: string } = {}

        if (args.zoom !== undefined) str_args.zoom = args.zoom.toString()
        if (args.x !== undefined) str_args.x = args.x.toString()
        if (args.y !== undefined) str_args.y = args.y.toString()

        return ACTIONS.change_route({ args: str_args })
    },
}


function debounce_change_routing_args (func: ChangeRoutingArgs, wait_ms: number): ChangeRoutingArgs
{
    let timeout: NodeJS.Timeout
    let merged_args: ChangeRoutingArgsArgs = {}

    return (args: ChangeRoutingArgsArgs) =>
    {
        if (timeout) clearTimeout(timeout)

        merged_args = { ...merged_args, ...args }

        timeout = setTimeout(() => func(merged_args), wait_ms)
    }
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


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

interface State
{
    x: number
    y: number
    zoom: number
}


const bound_zoom = (new_zoom: number) => bounded(new_zoom, 10, 4000)

class _Canvas extends Component<Props, State>
{
    private change_args_action: ChangeRoutingArgs
    private scale_by = 100
    private pointer_state: PointerState = {
        down: false,
        start_x: null,
        start_y: null,
        canvas_start_x: null,
        canvas_start_y: null,
    }

    constructor (props: Props)
    {
        super(props)

        this.state = {
            x: props.x,
            y: props.y,
            zoom: props.zoom,
        }

        this.change_args_action = debounce_change_routing_args(props.change_routing_args, 1000)
    }

    change_x = (x: number) =>
    {
        x = Math.round(x)
        this.setState({ x })
        this.change_args_action({ x })
    }

    change_y = (y: number) =>
    {
        y = Math.round(y)
        this.setState({ y })
        this.change_args_action({ y })
    }

    change_zoom = (new_zoom: number) =>
    {
        const bounded_new_zoom = bound_zoom(new_zoom)
        this.setState({ zoom: bounded_new_zoom })
        this.change_args_action({ zoom: bounded_new_zoom })
    }

    on_pointer_down = (e: h.JSX.TargetedEvent<HTMLDivElement, MouseEvent>) => {
        this.pointer_state.down = true
        this.pointer_state.start_x = e.clientX
        this.pointer_state.start_y = e.clientY
        this.pointer_state.canvas_start_x = this.state.x
        this.pointer_state.canvas_start_y = this.state.y
    }

    on_pointer_up = () => { this.pointer_state.down = false }

    on_pointer_move = (e: h.JSX.TargetedEvent<HTMLDivElement, MouseEvent>) => {
        if (this.pointer_state.down)
        {
            this.change_x(this.pointer_state.canvas_start_x + e.clientX - this.pointer_state.start_x)
            this.change_y(this.pointer_state.canvas_start_y + e.clientY - this.pointer_state.start_y)
        }
    }

    on_wheel = (e: h.JSX.TargetedEvent<HTMLDivElement, WheelEvent>) =>
    {
        e.stopPropagation()

        const old_zoom = this.state.zoom
        const new_zoom = bound_zoom(Math.round(old_zoom + (e.deltaY * -0.01 * old_zoom)))
        if (new_zoom === old_zoom) return

        const old_scale = old_zoom / this.scale_by
        const new_scale = new_zoom / this.scale_by

        const bounding_rect = e.currentTarget.getBoundingClientRect()
        const client_width = bounding_rect.width
        const client_height = bounding_rect.height
        const width_diff = client_width * new_scale - client_width * old_scale
        const height_diff = client_height * new_scale - client_height * old_scale
        const client_x = e.clientX - bounding_rect.left
        const client_y = e.clientY - bounding_rect.top

        const x_factor = ((client_x - this.state.x) / old_scale) / client_width
        const y_factor = ((client_y - this.state.y) / old_scale) / client_height

        this.change_zoom(new_zoom)
        this.change_x(this.state.x - width_diff * x_factor)
        this.change_y(this.state.y - height_diff * y_factor)
    }

    render ()
    {
        const scale = this.state.zoom / this.scale_by
        console.log("Canvas...")

        const background_style = {
            backgroundPosition: `${this.state.x}px ${this.state.y}px`,
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
        }
        const html_container_style = {
            transform: `translate(${this.state.x}px,${this.state.y}px) scale(${scale})`
        }

        const {
            project_priority_node_props,
            daily_action_node_props,
            set_action_ids_to_show,
            extent_of_content,
            origin_ms,
        } = this.props

        return (
        <div
            id="graph_container"
            style={background_style}
            onPointerDown={this.on_pointer_down}
            onPointerMove={this.on_pointer_move}
            onPointerUp={this.on_pointer_up}
            onWheel={this.on_wheel}
        >
            <div id="graph_visuals_container" style={html_container_style}>
                {project_priority_node_props.map(node_props => <ProjectPriorityNode {...node_props} />)}
                {daily_action_node_props.map(node_props => <DailyActionNode {...node_props} set_action_ids_to_show={set_action_ids_to_show} />)}

                <svg
                    width="900"
                    height="600"
                >
                    <g>
                        <CurrentDatetimeLine
                            extent_of_content={extent_of_content}
                            origin_ms={origin_ms}
                        />
                    </g>
                </svg>
            </div>

        </div>
        )
    }
}


export const Canvas = connector(_Canvas) as FunctionalComponent<OwnProps>
