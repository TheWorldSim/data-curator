import { FunctionComponent, h } from "preact"

import { LabelsList } from "../Labels/LabelsList"
import type { Statement } from "../state/State"


interface OwnProps {
    statement: Statement
    on_click: () => void
}


function _StatementListEntry (props: OwnProps)
{
    return [
        <td
            style={{ cursor: "pointer" }}
            onClick={() => props.on_click()}
        >
            {props.statement.content}
        </td>,
        <td>
            <LabelsList labels={props.statement.labels}/>
        </td>,
    ]
}


export const StatementListEntry = _StatementListEntry as unknown as FunctionComponent<OwnProps>
