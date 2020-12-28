import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import "./SearchWindow.css"
import type { RootState } from "../state/State"
import { ListOfTypes } from "./ListOfTypes"
import { useState } from "preact/hooks"


interface OwnProps
{
    on_choose: (id: string) => void
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


function calc_should_close (props: Props, time_stamp_first_rendered: number)
{
    const is_escape = props.last_key === "Escape"
    const is_new = props.last_key_time_stamp && props.last_key_time_stamp > time_stamp_first_rendered

    return is_escape && is_new
}


function _SearchWindow (props: Props)
{

    const [time_stamp_first_rendered] = useState(performance.now())
    const [search_string, set_search_string] = useState("")

    const should_close = calc_should_close(props, time_stamp_first_rendered)
    if (should_close) setTimeout(() => props.on_close(), 0)

    return <div id="search_background">
        <div id="search_box">
            Search
            <div id="search_close" onClick={() => props.on_close()}><span>X</span></div>

            <input
                type="text"
                value={search_string}
                onChange={e => set_search_string(e.currentTarget.value)}
                // TODO make focused
            ></input>

            <br />
            <br />

            <ListOfTypes
                filtered_by={search_string}
                on_click={(id: string) => props.on_choose(id)}
            />
        </div>
    </div>
}


export const SearchWindow = connector(_SearchWindow) as FunctionComponent<OwnProps>
