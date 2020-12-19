import { h } from "preact"
import type { Statement } from "src/state/State"


interface StatementListEntryProps
{
    statement: Statement
    on_click?: (id: string) => void
}

export function StatementListEntry (props: StatementListEntryProps)
{
    const { on_click = () => {} } = props

    return <div
        onClick={() => on_click(props.statement.id)}
    >{props.statement.content}</div>
}
