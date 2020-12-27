import { h } from "preact"

import type { Pattern } from "../state/State"


interface Props {
    pattern: Pattern
    on_click: () => void
}


export function PatternListEntry (props: Props)
{
    return <div
        style={{ cursor: "pointer" }}
        onClick={props.on_click}
    >
        {props.pattern.name}
    </div>
}