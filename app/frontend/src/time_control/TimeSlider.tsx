import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"
import { useState } from "preact/hooks"

import "./time_slider.css"
import { date2str_auto } from "../shared/utils/date_helpers"
import type { ProjectPriority } from "../planning/interfaces"
import { ACTIONS } from "../state/actions"
import type { RootState } from "../state/State"
import { datetime_ms_to_routing_args, routing_args_to_datetime_ms } from "../state/routing/routing_datetime"


interface OwnProps
{
    earliest_ms: number
    latest_ms: number
    events: ProjectPriority[]
}


function map_state (state: RootState)
{
    return {
        datetime_ms: routing_args_to_datetime_ms(state),
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
    const earliest_day_ms = Math.floor(props.earliest_ms / MSECONDS_PER_DAY) * MSECONDS_PER_DAY
    const latest_day_ms = Math.ceil(props.latest_ms / MSECONDS_PER_DAY) * MSECONDS_PER_DAY

    const [handle_position_ms, set_handle_position_ms] = useState(props.datetime_ms)

    function changed_handle_position (e: h.JSX.TargetedEvent<HTMLInputElement, Event>, update_route: boolean)
    {
        const new_handle_position_ms = parseInt(e.currentTarget.value)
        set_handle_position_ms(new_handle_position_ms)

        if (update_route)
        {
            const args = datetime_ms_to_routing_args(new_handle_position_ms)
            props.change_route({ route: undefined, sub_route: undefined, item_id: undefined, args })
        }
    }

    const unique_start_datetimes = new Set(props.events
        .map(event => event.start_date.getTime()))

    unique_start_datetimes.add(earliest_day_ms)
    unique_start_datetimes.add(latest_day_ms)

    const start_datetimes = [...unique_start_datetimes]
        .sort((a, b) => a < b ? -1 : (a > b ? 1 : 0))

    return <div className="time_slider">
        <input
            type="range"
            onChange={e => changed_handle_position(e, true)} // change to false for performance
            onMouseUp={e => changed_handle_position(e, true)}
            value={handle_position_ms}
            min={earliest_day_ms}
            max={latest_day_ms}
            list="tickmarks"
        ></input>
        <datalist id="tickmarks">
            {start_datetimes.map(d => <option value={d}>{d}</option>)}
        </datalist>

        {date2str_auto(new Date(handle_position_ms))}

    </div>
}


export const TimeSlider = connector(_TimeSlider) as FunctionalComponent<OwnProps>
