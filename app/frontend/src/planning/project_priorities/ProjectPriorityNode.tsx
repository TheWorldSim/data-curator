import { h } from "preact"
import { useState } from "preact/hooks"

import type { ProjectPriorityNodeProps } from "../../canvas/interfaces"


interface OwnProps
{
    node: ProjectPriorityNodeProps
}


export function ProjectPriorityNode (props: OwnProps)
{
    const [is_focused, set_is_focused] = useState(false)

    const { x, y, width, height, title, fields, effort, display } = props.node

    const w = effort > 0 ? Math.max(width, 150) : 150

    const style_outer: h.JSX.CSSProperties = {
        width: w,
        height,
        left: x,
        top: y,
        display: display ? "" : "none",
    }

    const percent = `${Math.round(effort * 100)}%`
    const backgroundImage = `linear-gradient(to top, #a6eaff ${percent}, rgba(0,0,0,0) ${percent})`
    const style_inner: h.JSX.CSSProperties = {
        padding: 5,
        whiteSpace: "nowrap",
        backgroundImage,
    }

    return <div
        className={"graph_node " + (is_focused ? "focused" : "")}
        style={style_outer}
        onMouseEnter={() => set_is_focused(true)}
        onMouseLeave={() => set_is_focused(false)}
    >
        <div style={style_inner}>
            <span title={title}>{title}</span>

            <hr />

            {fields.map(field => <div>
                {field.name}: {field.value}
            </div>)}
        </div>
    </div>
}
