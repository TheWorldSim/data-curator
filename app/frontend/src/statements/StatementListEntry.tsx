import { h } from "preact"

import { LabelsList } from "../labels/LabelsList"
import type { Statement } from "../state/State"
import { Link } from "../utils/Link"


interface OwnProps {
    statement: Statement
    on_click?: () => void
}


export function StatementListEntry (props: OwnProps)
{
    return [
        <td>
            <Link route="statements" item_id={props.statement.id} on_click={props.on_click}>
                {props.statement.content}
            </Link>
        </td>,
        <td>
            <LabelsList labels={props.statement.labels}/>
        </td>,
    ]
}
