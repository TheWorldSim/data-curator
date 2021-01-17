import { h } from "preact"

import type { DailyActionNodeProps } from "../../canvas/interfaces"


interface OwnProps extends DailyActionNodeProps
{
    set_action_ids_to_show: (action_ids: string[]) => void
}


export function DailyActionNode (props: OwnProps)
{
    const { x, y, width, height, display, action_ids, set_action_ids_to_show } = props

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
        onClick={() => set_action_ids_to_show(action_ids)}
    >
    </div>
}
