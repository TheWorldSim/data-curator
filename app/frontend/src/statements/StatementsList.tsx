import { h } from "preact"
import type { Statement } from "src/state/State"
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
    delete_statement: (id: string) => void
}

export function StatementsList (props: StatementsListProps)
{

    return <ul>
        {props.statements.map(statement => <li>
            <StatementListEntry statement={statement}/>
            <DeleteStatement delete_statement={() => props.delete_statement(statement.id)}/>
        </li>)}
    </ul>
}
