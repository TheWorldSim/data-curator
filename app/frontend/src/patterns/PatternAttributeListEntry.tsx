import { FunctionComponent, h } from "preact"
import { useState } from "preact/hooks"
import { connect } from "react-redux"
import { SearchWindow } from "../search/SearchWindow"

import "./PatternAttributeListEntry.css"
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
    const [display_search, set_display_search] = useState(false)

    let type_id_css_class = "empty"
    let type_id_desc = "Statement Type or Pattern"
    if (props.attribute.type_id)
    {
        type_id_css_class = ""
        const item = props.id_map[props.attribute.type_id]
        type_id_desc = item ? description(item) : props.attribute.type_id
    }

    if (!props.editable)
    {
        return [
            <td>{type_id_desc}</td>,
            <td>{props.attribute.alt_name}</td>,
            <td><input type="checkbox" title="Multiple values" checked={props.attribute.multiple} disabled={true}></input></td>,
        ]
    }

    function on_change_type_id (type_id: string)
    {
        if (props.editable) props.on_change({ ...props.attribute, type_id })
    }

    function on_change_alt_name (e: h.JSX.TargetedEvent<HTMLInputElement, Event>)
    {
        const alt_name = e.currentTarget.value
        if (props.editable) props.on_change({ ...props.attribute, alt_name })
    }

    function on_change_multiple (e: h.JSX.TargetedEvent<HTMLInputElement, Event>)
    {
        const multiple = e.currentTarget.checked
        if (props.editable) props.on_change({ ...props.attribute, multiple })
    }

    return [
        <td>
            <div
                class={"fake_text_input " + type_id_css_class}
                onClick={() => set_display_search(true)}
            >{type_id_desc}</div>
        </td>,
        <td>
            <input
                type="text"
                placeholder="Alternative description"
                value={props.attribute.alt_name}
                onChange={on_change_alt_name}
            ></input>
        </td>,
        <td>
            <input
                type="checkbox"
                title="Multiple values"
                checked={props.attribute.multiple}
                onChange={on_change_multiple}
            ></input>
        </td>,
        display_search && <SearchWindow  // This seems pretty hacky
            on_choose={(id: string) => {
                on_change_type_id(id)
                set_display_search(false)
            }}
            on_close={() => set_display_search(false)}
        />
    ]
}

const connector = connect(map_state)
export const PatternAttributeListEntry = connector(_PatternAttributeListEntry) as FunctionComponent<OwnProps>


export const PatternAttributeListHeader = () => <tr style={{ fontSize: "small", textAlign: "center" }}>
    <td></td>
    <td></td>
    <td>M</td>
</tr>
