import { h } from "preact"

import type { Objekt } from "../state/State"
import { Link } from "../utils/Link"
import { ObjectDescription } from "./ObjectDescription"


interface OwnProps {
    object: Objekt
    on_click?: () => void
}


export function ObjectListEntry (props: OwnProps)
{
    return <td>
        <Link route="objects" item_id={props.object.id} on_click={props.on_click}>
            <ObjectDescription object={props.object}/>
        </Link>
    </td>
}
