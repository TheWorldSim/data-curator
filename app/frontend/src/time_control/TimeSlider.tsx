import { h } from "preact"

import "./time_slider.css"
import { useState } from "preact/hooks"
import { date2str } from "../shared/utils/date_helpers"


export interface EventObject
{
    start_date: Date
    name: string
    object_id: string
}


interface OwnProps
{
    earliest_ms: number
    latest_ms: number
    events: EventObject[]
}

const MSECONDS_PER_DAY = 86400000


export function TimeSlider (props: OwnProps)
{
    const earliest_day = Math.floor(props.earliest_ms / MSECONDS_PER_DAY)
    const latest_day = Math.floor(props.latest_ms / MSECONDS_PER_DAY)

    const [handle_position, set_handle_position] = useState(0)

    return <div className="time_slider">
        <input
            type="range"
            onChange={e => set_handle_position(parseInt(e.currentTarget.value))}
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
