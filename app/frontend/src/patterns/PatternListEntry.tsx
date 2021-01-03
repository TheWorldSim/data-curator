import { h } from "preact"

import type { Pattern } from "../state/State"
import { Link } from "../utils/Link"


interface OwnProps {
    pattern: Pattern
    on_click?: () => void
}


export function PatternListEntry (props: OwnProps)
{
    return [
    <td>
        <Link route="patterns" item_id={props.pattern.id} on_click={props.on_click}>
            {props.pattern.name}
        </Link>
    </td>,
    <td></td>
    ]
}
