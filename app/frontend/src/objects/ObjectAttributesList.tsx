import { h } from "preact"

import type { ObjectAttribute } from "../state/State"
import { ObjectAttributeListEntry, ObjectAttributeListHeader } from "./ObjectAttributeListEntry"


type Props = {
    attributes: ObjectAttribute[]
}


export function ObjectAttributesList (props: Props)
{
    return <table>
        <ObjectAttributeListHeader />
        {props.attributes.map((attribute, i) => <tr>
            <ObjectAttributeListEntry attribute={attribute} editable={false} />
        </tr>)}
    </table>
}
