import type { GraphNode } from "../canvas/interfaces"
import type { Priorities, ProjectPriority } from "./get_priorities"


interface ConvertPrioritiesToNodesArgs
{
    priorities: Priorities
    display_at_datetime_ms: number
    scale: number
}
export function convert_priorities_to_nodes (args: ConvertPrioritiesToNodesArgs): GraphNode[]
{
    const { priorities, display_at_datetime_ms, scale } = args
    const { earliest_ms, events } = priorities
    const scale_days = scale / MSECONDS_PER_DAY

    const x = (start_datetime_ms: number) => (start_datetime_ms - earliest_ms) * scale_days

    const width = (start_datetime_ms: number, stop_datetime_ms: number) => {
        const w = stop_datetime_ms - start_datetime_ms
        return w * scale_days
    }

    const events_by_project = group_events_by_project(events)

    const nodes: GraphNode[] = events.map((p, i) => {
        const start_datetime_ms = p.start_date.getTime()

        const related_events = events_by_project[p.project_id].events
        const next_event = get_next_event(related_events, p.id)
        const max_stop_datetime_ms = next_event ? next_event.start_date.getTime() : Number.POSITIVE_INFINITY
        const stop_datetime_ms = Math.min(max_stop_datetime_ms, display_at_datetime_ms)

        const y = events_by_project[p.project_id].vertical_position

        const node: GraphNode = {
            title: p.name,
            fields: p.fields,

            x: x(start_datetime_ms),
            y: y * 8 * scale,
            width: width(start_datetime_ms, stop_datetime_ms),
            height: 7 * scale,

            display: start_datetime_ms <= display_at_datetime_ms,
        }

        return node
    })

    return nodes
}


const MSECONDS_PER_DAY = 86400000


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
