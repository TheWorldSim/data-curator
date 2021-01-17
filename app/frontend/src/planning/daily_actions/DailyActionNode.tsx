import { h } from "preact"

import type { DailyActionNodeProps } from "../../canvas/interfaces"


export function DailyActionNode (props: DailyActionNodeProps)
{
    const { x, y, width, height, display, action_ids } = props

    const style_outer: h.JSX.CSSProperties = {
        width,
        height,
        left: x,
        top: y,
        display: display ? "" : "none",
        backgroundColor: "orange",
        borderRadius: "2px",
        border: "thin solid #777",
    }

    return <div
        className={"graph_node"}
        style={style_outer}
        title={`${action_ids.length} actions`}
        onClick={() => {}}
    >
    </div>
}
