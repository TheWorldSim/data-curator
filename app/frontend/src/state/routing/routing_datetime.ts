import { date2str } from "../../shared/utils/date_helpers"
import type { RootState } from "../State"


const MSECONDS_PER_MINUTE = 60000
const MSECONDS_PER_HOUR = MSECONDS_PER_MINUTE * 60
// const MSECONDS_PER_DAY = MSECONDS_PER_HOUR * 24

export function routing_args_to_datetime_ms (state: RootState)
{
    const date_position = new Date(state.routing.args.date)
    const time_position = /^([012]?\d):(\d\d)/.exec(state.routing.args.time)

    if (Number.isNaN(date_position.getTime()) || !time_position) return 0

    const hours = parseInt(time_position[1], 10)
    const minutes = parseInt(time_position[0], 10)

    return date_position.getTime() + (hours * MSECONDS_PER_HOUR) + (minutes * MSECONDS_PER_HOUR)
}


export function datetime_to_routing_args (date: Date): { date: string, time: string }
{
    return {
        date: date2str(date, "yyyy-MM-dd"),
        time: date2str(date, "hh:mm"),
    }
}

export function datetime_ms_to_routing_args (date_ms: number): { date: string, time: string }
{
    const date = new Date(date_ms)
    return datetime_to_routing_args(date)
}
