import { h } from "preact"

import type { ObjectAttribute } from "../state/State"
import { DeleteButton } from "../sharedf/DeleteButton"
import { ObjectAttributeListEntry, ObjectAttributeListHeader } from "./ObjectAttributeListEntry"

interface OwnProps {
    attributes: ObjectAttribute[]
    change_attributes: (new_attributes: ObjectAttribute[]) => void
    delete_attribute: (index: number) => void
}


function _EditableObjectAttributesList (props: OwnProps)
{

    function add_attribute ()
    {
        const new_blank_attribute: ObjectAttribute = {
            tid: "",
            id: "",
        }
        props.change_attributes([...props.attributes, new_blank_attribute])
    }

    const change_attribute = (index: number) => (attribute: ObjectAttribute) =>
    {
        const new_attributes = [...props.attributes]
        new_attributes[index] = attribute
        props.change_attributes(new_attributes)
    }

    return <div>
        <table>
            {!!props.attributes.length && <ObjectAttributeListHeader />}
            {props.attributes.map((attribute, i) => <tr> {/* TODO set key */}
                <ObjectAttributeListEntry attribute={attribute} on_change={change_attribute(i)} editable={true} />
                <td>
                    <DeleteButton on_delete={() => props.delete_attribute(i) } />
                </td>
            </tr>)}
        </table>
        <input type="button" value="Add attribute" onClick={add_attribute} />
    </div>
}


export const EditableObjectAttributesList = _EditableObjectAttributesList
