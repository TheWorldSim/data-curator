import { h } from "preact"
import { connect } from "react-redux"

import type { Item, PatternAttribute, RootState } from "../state/State"
import { get_id_map } from "../utils/get_id_map"
import { description } from "../utils/item"


interface StateProps {
    id_map: { [id: string]: Item }
}

type OwnProps = {
    attribute: PatternAttribute
    on_change: (attribute: PatternAttribute) => void
    editable: true
} | {
    attribute: PatternAttribute
    editable: false
}

type Props = StateProps & OwnProps


const map_state = (state: RootState, own_props: OwnProps): StateProps => {

    const ids = [own_props.attribute.type_id]
    const id_map = get_id_map(ids, state)

    return { id_map }
}


function _PatternAttributeListEntry (props: Props)
{
    const item = props.id_map[props.attribute.type_id]
    const desc = description(item)

    if (!props.editable)
    {
        return [
            <td>{desc}</td>,
            <td>{props.attribute.alt_name}</td>,
            <td><input type="checkbox" title="Multiple values" checked={props.attribute.multiple} disabled={true}></input></td>,
        ]
    }

    return [
        <td>
            <input type="text" placeholder="Statement Type or Pattern" value={desc}></input>
        </td>,
        <td>
            <input type="text" placeholder="Alternative description" value={props.attribute.alt_name}></input>
        </td>,
        <td>
            <input type="checkbox" title="Multiple values" checked={props.attribute.multiple}></input>
        </td>,
    ]
}

const connector = connect(map_state)
export const PatternAttributeListEntry = connector(_PatternAttributeListEntry)


export const PatternAttributeListHeader = () => <tr style={{ fontSize: "small", textAlign: "center" }}>
    <td></td>
    <td></td>
    <td>M</td>
</tr>
