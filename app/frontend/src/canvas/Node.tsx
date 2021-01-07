import { h } from "preact"
import type { GraphNode } from "./interfaces";


interface OwnProps
{
    node: GraphNode
}


export function Node (props: OwnProps)
{
    const { x, y, width, height, title, fields, display } = props.node

    const w = Math.max(width, 150)

    return <div
        className="graph_node"
        style={{ width: w, height, left: x, top: y, display: display ? "" : "none" }}
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
