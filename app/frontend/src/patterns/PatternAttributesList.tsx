import { h } from "preact"

import type { PatternAttribute } from "../state/State"
import { PatternAttributeListEntry } from "./PatternAttributeListEntry"


type Props = {
    attributes: PatternAttribute[]
}


export function PatternAttributesList (props: Props)
{
    return <table>
        {props.attributes.map((attribute, i) => <tr>
            {...PatternAttributeListEntry({ attribute, editable: false })}
        </tr>)}
    </table>
}
