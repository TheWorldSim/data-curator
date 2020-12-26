import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { PatternAttribute, RootState } from "../state/State"
import { DeleteButton } from "../sharedf/DeleteButton"
import { PatternAttributeListEntry } from "./PatternAttributeListEntry"


const map_state = (state: RootState) => ({
    // attributes: state.
})

const map_dispatch = {
    // delete_pattern: (id: string) => ACTIONS.delete_pattern(id)
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = /*PropsFromRedux &*/ {
    attributes: PatternAttribute[]
    change_attributes: (new_attributes: PatternAttribute[]) => void
    delete_attribute: (index: number) => void
}


function _PatternAttributesList (props: Props)
{

    function add_attribute ()
    {
        const new_blank_attribute: PatternAttribute = {
            statement_type_id: "",
            alt_name: "",
        }
        props.change_attributes([...props.attributes, new_blank_attribute])
    }

    const change_attribute = (index: number) => (attribute: PatternAttribute) =>
    {
        const new_attributes = [...props.attributes]
        new_attributes[index] = attribute
        props.change_attributes(new_attributes)
    }

    return <table>
        {props.attributes.map((attribute, i) => <tr>
            {...PatternAttributeListEntry({ attribute, on_change: change_attribute(i) })}
            <td>
                <DeleteButton delete={() => props.delete_attribute(i)}/>
            </td>
        </tr>)}
        <tr>
            <td>
                <input type="button" value="Add attribute" onClick={add_attribute} />
            </td>
        </tr>
    </table>
}


export const PatternAttributesList = _PatternAttributesList // connector(_PatternAttributesList)
