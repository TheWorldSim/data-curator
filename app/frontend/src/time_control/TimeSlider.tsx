import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"
import { useState } from "preact/hooks"

import "./time_slider.css"
import { date2str } from "../shared/utils/date_helpers"
import type { ProjectPriority } from "../planning/get_priorities"
import { ACTIONS } from "../state/store"
import type { RootState } from "../state/State"


interface OwnProps
{
    earliest_ms: number
    latest_ms: number
    events: ProjectPriority[]
}


function map_state (state: RootState)
{
    return {
        position: get_time_position(state),
    }
}


const map_dispatch = {
    change_route: ACTIONS.change_route
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


const MSECONDS_PER_DAY = 86400000
function _TimeSlider (props: Props)
{
    const earliest_day = Math.floor(props.earliest_ms / MSECONDS_PER_DAY)
    const latest_day = Math.floor(props.latest_ms / MSECONDS_PER_DAY)

    const [handle_position, set_handle_position] = useState(props.position)

    function changed_handle_position (e: h.JSX.TargetedEvent<HTMLInputElement, Event>, update_route: boolean)
    {
        const position = parseInt(e.currentTarget.value)
        set_handle_position(position)
        const args = { "time": position.toString() }
        if (update_route)
        {
            props.change_route({ route: undefined, sub_route: undefined, item_id: undefined, args })
        }
    }

    return <div className="time_slider">
        <input
            type="range"
            onChange={e => changed_handle_position(e, false)}
            onMouseUp={e => changed_handle_position(e, true)}
            value={handle_position}
            min={0}
            max={latest_day - earliest_day}
            list="tickmarks"
        ></input>
        <datalist id="tickmarks">
            {props.events
                .map(event => (event.start_date.getTime() / MSECONDS_PER_DAY) - earliest_day)
                .sort()
                .map(d => <option value={d}>{d}</option>)}
        </datalist>

        {date2str(new Date((earliest_day + handle_position) * MSECONDS_PER_DAY), "yyyy-MM-dd")}

    </div>
}


export const TimeSlider = connector(_TimeSlider) as FunctionalComponent<OwnProps>


export function get_time_position (state: RootState)
{
    const position = parseInt(state.routing.args.time)

    return Number.isNaN(position) ? 0 : position
}
