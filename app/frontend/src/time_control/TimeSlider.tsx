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
    if (handle_position === 0 && earliest_day > 0) set_handle_position(earliest_day)

    return <div className="time_slider">
        <input
            type="range"
            onChange={e => set_handle_position(parseInt(e.currentTarget.value))}
            value={handle_position}
            min={earliest_day}
            max={latest_day}
        ></input>

        {date2str(new Date(handle_position * MSECONDS_PER_DAY), "yyyy-MM-dd")}
    </div>
}
