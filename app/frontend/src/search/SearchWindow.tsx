import { Component, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import "./SearchWindow.css"
import type { RootState } from "../state/State"


function map_state (state: RootState)
{
    return {
        last_key: state.global_key_press.last_key,
        last_key_time_stamp: state.global_key_press.last_key_time_stamp,
    }
}


const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux &
{
    on_change: (value: string) => void
    on_close: () => void
}


class _SearchWindow extends Component<Props, { time_stamp_first_rendered: number }>
{
    constructor(props: Props) {
        super(props)

        this.state = {
            time_stamp_first_rendered: performance.now()
        }
    }

    shouldComponentUpdate (new_props: Props)
    {
        const is_escape = new_props.last_key === "Escape"
        const is_new = new_props.last_key_time_stamp && new_props.last_key_time_stamp > this.state.time_stamp_first_rendered

        const should_close = is_escape && is_new

        if (should_close)
        {
            setTimeout(() => {
                this.props.on_close()
            }, 0)
        }

        return !should_close
    }

    render ()
    {
        return <div id="search_background">
            <div id="search_box">
                Search
                <div id="search_close" onClick={() => this.props.on_close()}><span>X</span></div>
            </div>
        </div>
    }
}


export const SearchWindow = connector(_SearchWindow)
