import { h } from "preact"

import type { Objekt } from "../state/State"
import { ObjectDescription } from "./ObjectDescription"


interface OwnProps {
    object: Objekt
    on_click: () => void
}


export function ObjectListEntry (props: OwnProps)
{
    return <td
        style={{ cursor: "pointer" }}
        onClick={props.on_click}
    >
        <ObjectDescription object={props.object}/>
    </td>
}
