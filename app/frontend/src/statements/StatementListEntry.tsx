import { h } from "preact"
import type { Statement } from "src/State"


interface StatementListEntryProps
{
    statement: Statement
}

export function StatementListEntry (props: StatementListEntryProps)
{
    return <div>{props.statement.content}</div>
}
