import { FunctionComponent, h } from "preact"
import { connect } from "react-redux"

import { is_id_attribute, is_value_attribute, Item, ObjectAttribute, RootState } from "../state/State"
import { get_id_map } from "../utils/get_id_map"
import { ItemSelect } from "../search/ItemSelect"


interface StateProps {
    id_map: { [id: string]: Item }
}

type OwnProps = {
    attribute: ObjectAttribute
    on_change: (attribute: ObjectAttribute) => void
    editable: true
} | {
    attribute: ObjectAttribute
    editable: false
}

type Props = StateProps & OwnProps


const map_state = (state: RootState, own_props: OwnProps): StateProps => {

    const ids: string[] = [] // [own_props.attribute.type_id]
    const id_map = get_id_map(ids, state)

    return { id_map }
}


function _ObjectAttributeListEntry (props: Props)
{

    return [
        <td>
            <ItemSelect
                editable={false}
                item_id={props.attribute.pattern.type_id}
                filter="types"
            />
        </td>,
        <td>
            {is_id_attribute(props.attribute) && <ItemSelect
                editable={false}
                item_id={props.attribute.id}
                filter="types"
            />}
            {is_value_attribute(props.attribute) && <input
                value={props.attribute.value}
                disabled={true}
            />}
        </td>,
    ]

    // function on_change_type_id (type_id: string)
    // {
    //     if (props.editable) props.on_change({ ...props.attribute, type_id })
    // }

    // function on_change_alt_name (e: h.JSX.TargetedEvent<HTMLInputElement, Event>)
    // {
    //     const alt_name = e.currentTarget.value
    //     if (props.editable) props.on_change({ ...props.attribute, alt_name })
    // }

    // function on_change_multiple (e: h.JSX.TargetedEvent<HTMLInputElement, Event>)
    // {
    //     const multiple = e.currentTarget.checked
    //     if (props.editable) props.on_change({ ...props.attribute, multiple })
    // }

    return [
        // <td>
        //     <ItemSelect
        //         editable={true}
        //         item_id={props.attribute.type_id}
        //         filter="types"
        //         on_change_item_id={on_change_type_id}
        //     />
        // </td>,
        // <td>
        //     <input
        //         type="text"
        //         placeholder="Alternative description"
        //         value={props.attribute.alt_name}
        //         onChange={on_change_alt_name}
        //     ></input>
        // </td>,
        // <td>
        //     <input
        //         type="checkbox"
        //         title="Multiple values"
        //         checked={props.attribute.multiple}
        //         onChange={on_change_multiple}
        //     ></input>
        // </td>
    ]
}

const connector = connect(map_state)
export const ObjectAttributeListEntry = connector(_ObjectAttributeListEntry) as FunctionComponent<OwnProps>
