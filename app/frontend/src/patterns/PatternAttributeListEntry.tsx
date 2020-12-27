import { h } from "preact"
import { useState } from "preact/hooks"
import { connect } from "react-redux"
import { SearchWindow } from "../search/SearchWindow"

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

    const item = props.id_map[props.attribute.type_id]
    const desc = item ? description(item) : props.attribute.type_id

    if (!props.editable)
    {
        return [
            <td>{desc}</td>,
            <td>{props.attribute.alt_name}</td>,
            <td><input type="checkbox" title="Multiple values" checked={props.attribute.multiple} disabled={true}></input></td>,
        ]
    }

    function on_change_type_id (e: h.JSX.TargetedEvent<HTMLInputElement, Event>)
    {
        const type_id = e.currentTarget.value
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
            <input
                type="text"
                placeholder="Statement Type or Pattern"
                value={desc}
                onFocus={() => set_display_search(true)}
                onChange={on_change_type_id}
            ></input>
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
            on_change={(v) => console.log("change ", v)}
            on_close={() => set_display_search(false)}
        />
    ]
}

const connector = connect(map_state)
export const PatternAttributeListEntry = connector(_PatternAttributeListEntry)


export const PatternAttributeListHeader = () => <tr style={{ fontSize: "small", textAlign: "center" }}>
    <td></td>
    <td></td>
    <td>M</td>
</tr>
