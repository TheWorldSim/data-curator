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
    const { earliest_ms, project_priorities } = priorities
    const scale_days = scale / MSECONDS_PER_DAY

    const x = (start_datetime_ms: number) => (start_datetime_ms - earliest_ms) * scale_days

    const width = (start_datetime_ms: number, stop_datetime_ms: number) => {
        const w = stop_datetime_ms - start_datetime_ms
        return w * scale_days
    }

    const unordered_priorities_by_project = group_priorities_by_project(project_priorities)
    const priorities_by_project = order_priorities_by_project(unordered_priorities_by_project)

    const nodes: GraphNode[] = []

    Object.keys(priorities_by_project).forEach(project_id =>
    {
        const { project_priorities, vertical_position } = priorities_by_project[project_id]

        project_priorities.forEach(({ id, name, start_date, fields }) =>
        {
            const start_datetime_ms = start_date.getTime()

            const next_event = get_next_event(project_priorities, id)
            const max_stop_datetime_ms = next_event ? next_event.start_date.getTime() : Number.POSITIVE_INFINITY
            const stop_datetime_ms = Math.min(max_stop_datetime_ms, display_at_datetime_ms)

            const y = vertical_position * 8 * scale
            const height = 7 * scale

            const effort_field = fields.find(f => f.name === "Effort")
            const effort = effort_field ? parseFloat(effort_field.value) : 0
            const display = start_datetime_ms <= display_at_datetime_ms

            const node: GraphNode = {
                title: name,
                fields,

                x: x(start_datetime_ms),
                y,
                width: width(start_datetime_ms, stop_datetime_ms),
                height,

                effort,
                display,
            }

            nodes.push(node)
        })

    })

    return nodes
}


const MSECONDS_PER_DAY = 86400000


interface EventsByProject
{
    [ project_id: string ]: {
        project_priorities: ProjectPriority[]
        vertical_position: number
    }
}

function group_priorities_by_project (project_priorities: ProjectPriority[])
{
    const priorities_by_project: EventsByProject = {}

    project_priorities.forEach(project_priority => {
        const { project_id } = project_priority

        if (!priorities_by_project[project_id])
        {
            priorities_by_project[project_id] = { project_priorities: [], vertical_position: 0 }
        }

        priorities_by_project[project_id].project_priorities.push(project_priority)
    })

    return priorities_by_project
}


function order_priorities_by_project (priorities_by_project: EventsByProject): EventsByProject
{
    const projects_by_start_ms: { project_id: string, start_ms: number }[] = []

    Object.keys(priorities_by_project).forEach(project_id =>
    {
        let { project_priorities } = priorities_by_project[project_id]
        project_priorities.sort((a, b) => a.start_date.getTime() < b.start_date.getTime() ? -1 : 1)
        priorities_by_project[project_id].project_priorities = project_priorities

        if (project_priorities.length === 0) return

        projects_by_start_ms.push({
            project_id,
            start_ms: project_priorities[0].start_date.getTime()
        })
    })

    projects_by_start_ms.sort((a, b) =>
    {
        return a.start_ms < b.start_ms
            ? -1
            : (a.start_ms > b.start_ms
                ? 1
                : (a.project_id < b.project_id ? -1 : 1))
    })

    projects_by_start_ms.forEach(({ project_id }, index) =>
    {
        priorities_by_project[project_id].vertical_position = index
    })

    return priorities_by_project
}


function get_next_event (events: ProjectPriority[], project_priority_id: string): ProjectPriority | undefined
{
    const index = events.findIndex(({ id }) => id === project_priority_id)

    if (index < 0) return undefined

    return events[index + 1]
}
