import { h } from "preact"
import { useState } from "preact/hooks"

import type { GraphNode } from "./interfaces"


interface OwnProps
{
    node: GraphNode
}


export function Node (props: OwnProps)
{
    const [is_focused, set_is_focused] = useState(false)

    const { x, y, width, height, title, fields, effort, display } = props.node

    const w = effort > 0 ? Math.max(width, 150) : 150

    return <div
        className={"graph_node " + (is_focused ? "focused" : "")}
        style={{ width: w, height, left: x, top: y, display: display ? "" : "none" }}
        onMouseEnter={() => set_is_focused(true)}
        onMouseLeave={() => set_is_focused(false)}
    >
        <div style={{ padding: 5, whiteSpace: "nowrap" }}>
            {title}

            <hr />

            {fields.map(field => <div>
                {field.name}: {field.value}
            </div>)}
        </div>
    </div>
}
