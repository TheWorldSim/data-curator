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
    editable_type: boolean
} | {
    attribute: ObjectAttribute
    editable: false
    editable_type?: false
}

type Props = StateProps & OwnProps


const map_state = (state: RootState, own_props: OwnProps): StateProps => {

    const ids: string[] = [] // [own_props.attribute.type_id]
    const id_map = get_id_map(ids, state)

    return { id_map }
}


function _ObjectAttributeListEntry (props: Props)
{
    const attribute = props.attribute

    function on_change_id (id: string)
    {
        if (props.editable)
        {
            const changed_attribute = { ...props.attribute, id }
            delete (changed_attribute as any).value
            props.on_change(changed_attribute)
        }
    }

    function on_change_value (value: string)
    {
        if (props.editable)
        {
            const changed_attribute = { ...props.attribute, value }
            delete (changed_attribute as any).id
            props.on_change(changed_attribute)
        }
    }

    return [
        <td>
            <ItemSelect
                editable={!!props.editable_type}
                item_id={attribute.pattern.type_id}
                filter="types"
            />
        </td>,
        <td>
            {attribute.pattern.alt_name}
        </td>,
        <td>
            {is_id_attribute(attribute) && <ItemSelect
                editable={props.editable}
                item_id={attribute.id}
                filter="all_concrete"
                on_change_item_id={on_change_id}
            />}
            {is_value_attribute(attribute) && <input
                value={attribute.value}
                disabled={!props.editable}
                onChange={e => on_change_value(e.currentTarget.value)}
            />}
        </td>,
    ]



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
