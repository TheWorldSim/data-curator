import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import "./SearchWindow.css"
import type { Item, RootState } from "../state/State"
import { ITEM_FILTERS, ListOfTypes } from "./ListOfTypes"
import { useState } from "preact/hooks"


interface OwnProps
{
    specific_type_id?: string
    filter_type: ITEM_FILTERS
    on_choose: (item: Item) => void
    on_close: () => void
}


function map_state (state: RootState)
{
    return {
        last_key: state.global_key_press.last_key,
        last_key_time_stamp: state.global_key_press.last_key_time_stamp,
    }
}

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function focus_search_box (html_id: string)
{
    const el = document.getElementById(html_id)
    if (el) el.focus()
}


function calc_should_close (props: Props, time_stamp_first_rendered: number)
{
    const is_escape = props.last_key === "Escape"
    const is_new = props.last_key_time_stamp && props.last_key_time_stamp > time_stamp_first_rendered

    return is_escape && is_new
}


function _SearchWindow (props: Props)
{

    const time_stamp = performance.now()
    const [time_stamp_first_rendered] = useState(time_stamp)
    const [search_string, set_search_string] = useState("")
    const first_render = time_stamp === time_stamp_first_rendered

    const id_search_box = "search_box"
    if (first_render) setTimeout(() => focus_search_box(id_search_box), 0)

    const should_close = calc_should_close(props, time_stamp_first_rendered)
    if (should_close) setTimeout(() => props.on_close(), 0)

    return <div id="search_background">
        <div id="search_container">
            Search
            <div id="search_close" onClick={() => props.on_close()}><span>X</span></div>

            <input
                id={id_search_box}
                type="text"
                value={search_string}
                onChange={e => set_search_string(e.currentTarget.value)}
            ></input>

            <br />
            <br />
            <hr />

            <ListOfTypes
                specific_type_id={props.specific_type_id}
                filter_type={props.filter_type}
                filtered_by_string={search_string}
                on_click={(item: Item) => props.on_choose(item)}
            />
        </div>
    </div>
}


export const SearchWindow = connector(_SearchWindow) as FunctionComponent<OwnProps>
