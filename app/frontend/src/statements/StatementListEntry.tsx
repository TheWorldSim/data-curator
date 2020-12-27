import { h } from "preact"

import type { Statement } from "../state/State"


interface Props {
    statement: Statement
    on_click: () => void
}


export function StatementListEntry (props: Props)
{
    return <div
        style={{ cursor: "pointer" }}
        onClick={props.on_click}
    >{props.statement.content}</div>
}
