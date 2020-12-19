import { h } from "preact"

import type { Statement } from "../state/State"


interface Props {
    statement: Statement
}


export function StatementListEntry (props: Props)
{
    return <div>{props.statement.content}</div>
}
