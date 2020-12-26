import { h } from "preact"

import type { PatternAttribute } from "../state/State"


type Props = {
    attribute: PatternAttribute
    on_change: (attribute: PatternAttribute) => void
    editable: true
} | {
    attribute: PatternAttribute
    editable: false
}


export function PatternAttributeListEntry (props: Props)
{
    if (!props.editable)
    {
        return [
            <td>{props.attribute.statement_type_id}</td>,
            <td>{props.attribute.alt_name}</td>,
            <td><input type="checkbox" checked={props.attribute.multiple} disabled={true}></input></td>,
        ]
    }

    return [
        <td>
            <input type="text" placeholder="Statement ID" value={props.attribute.statement_type_id}></input>
        </td>,
        <td>
            <input type="text" placeholder="Alternative description" value={props.attribute.alt_name}></input>
        </td>,
        <td>
            <input type="checkbox" checked={props.attribute.multiple}></input>
        </td>,
    ]
}
