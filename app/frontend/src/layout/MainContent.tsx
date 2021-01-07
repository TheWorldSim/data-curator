import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { Canvas } from "../canvas/Canvas"
import type { GraphNode } from "../canvas/interfaces"
import { ProjectPriority, get_priorities, Priorities } from "../planning/get_priorities"
import type { RootState } from "../state/State"
import { get_time_position } from "../time_control/TimeSlider"


interface OwnProps {}


const map_state = (state: RootState) => {
    const time_position = get_time_position(state)

    return {
        route: state.routing.route,
        nodes: convert_priorities_to_nodes(get_priorities(state), time_position),
    }
}


const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _MainContent (props: Props)
{
    return <div>
        <Canvas nodes={props.nodes} />
    </div>
}


export const MainContent = connector(_MainContent) as FunctionComponent<OwnProps>


//

const SCALE = 10
function convert_priorities_to_nodes (priorities: Priorities, time_position: number): GraphNode[]
{
    const { earliest_ms, events } = priorities
    const earliest_days = earliest_ms / MSECONDS_PER_DAY
    const current_end_days = Math.floor(get_days(new Date()))
    const display_end_days = earliest_days + time_position
    const end_days = Math.min(current_end_days, display_end_days)

    const x = (start_days: number) => (start_days - earliest_days) * SCALE

    const width = (start_days: number, stop_days: number | undefined) => {
        const stop = stop_days === undefined ? end_days : Math.min(stop_days, end_days)
        const w = stop - start_days
        return w * SCALE
    }

    const events_by_project = group_events_by_project(events)

    const nodes: GraphNode[] = events.map((p, i) => {
        const start_days = get_days(p.start_date)

        const related_events = events_by_project[p.project_id].events
        const next_event = get_next_event(related_events, p.id)
        const stop_days = next_event ? get_days(next_event.start_date) : undefined

        const y = events_by_project[p.project_id].vertical_position

        const node: GraphNode = {
            title: p.name,
            fields: p.fields,

            x: x(start_days),
            y: y * 8 * SCALE,
            width: width(start_days, stop_days),
            height: 7 * SCALE,

            display: start_days <= end_days,
        }

        return node
    })

    return nodes
}


const MSECONDS_PER_DAY = 86400000
function get_days (datetime: Date)
{
    return datetime.getTime() / MSECONDS_PER_DAY
}


function group_events_by_project (events: ProjectPriority[])
{
    const events_by_project: {[ project_id: string ]: { events: ProjectPriority[], vertical_position: number } }  = {}
    let y = 0

    events.forEach(event => {
        const { project_id } = event

        if (!events_by_project[project_id]) events_by_project[project_id] = { events: [], vertical_position: y++ }
        events_by_project[project_id].events.push(event)
    })

    return events_by_project
}


function get_next_event (events: ProjectPriority[], project_priority_id: string): ProjectPriority | undefined
{
    const index = events.findIndex(({ id }) => id === project_priority_id)

    if (index < 0) return undefined

    return events[index + 1]
}
