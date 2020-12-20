import { h } from "preact"
import { useState } from "preact/hooks"

type MouseState =
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
const mouse_state: MouseState = {
    down: false,
    start_x: null,
    start_y: null,
    canvas_start_x: null,
    canvas_start_y: null,
}
export function Canvas ()
{
    const [x, change_x] = useState(0)
    const [y, change_y] = useState(0)
    const [scale, change_scale] = useState(1)

    function on_mouse_down (e: h.JSX.TargetedEvent<SVGSVGElement, MouseEvent>) {
        mouse_state.down = true
        mouse_state.start_x = e.clientX
        mouse_state.start_y = e.clientY
        mouse_state.canvas_start_x = x
        mouse_state.canvas_start_y = y
    }
    function on_mouse_up () { mouse_state.down = false }

    function on_mouse_move (e: h.JSX.TargetedEvent<SVGSVGElement, MouseEvent>)
    {
        if (mouse_state.down)
        {
            change_x(mouse_state.canvas_start_x + e.clientX - mouse_state.start_x)
            change_y(mouse_state.canvas_start_y + e.clientY - mouse_state.start_y)
        }
    }

    const transform = `translate(${x},${y}) scale(${scale})`

    return (
    <div style={{ backgroundImage: "linear-gradient(to right, #4F4E4F 1px, transparent 1px),linear-gradient(to bottom, #4F4E4F 1px, transparent 1px)"}}>
        <svg
            width="900"
            height="600"
            onMouseDown={on_mouse_down}
            onMouseMove={on_mouse_move}
            onMouseUp={on_mouse_up}
        >
            <g transform={transform}>
                <rect width="100" height="100" />
            </g>
        </svg>
    </div>
    )
}