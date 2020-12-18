import { h } from "preact"
import type { Statement } from "src/State"
import { StatementListEntry } from "./StatementListEntry"

interface DeleteStatementProps
{
    delete_statement: () => void
}

function DeleteStatement (props: DeleteStatementProps)
{
    return <input type="button" value="X" onClick={() => props.delete_statement()}></input>
}


interface StatementsListProps
{
    statements: Statement[]
    delete_statement?: (id: string) => void
    format?: "json"
}

export function StatementsList (props: StatementsListProps)
{
    if (props.format === "json")
    {
        const json = props.statements.length ? JSON.stringify(props.statements) : ""
        return <div>{json}</div>
    }

    const { delete_statement } = props

    return <ul>
        {props.statements.map(statement => <li>
            <StatementListEntry statement={statement}/>
            <DeleteStatement delete_statement={() => delete_statement && delete_statement(statement.id)}/>
        </li>)}
    </ul>
}
