import type { NodeField } from "../canvas/interfaces"
import type { CoreObjectIdAttribute, CoreObjectValueAttribute, RootState } from "../state/State"


export interface ProjectPriority
{
    id: string
    start_date: Date
    name: string
    project_id: string
    fields: NodeField[]
}


export interface Priorities
{
    project_priorities: ProjectPriority[]
    earliest_ms: number
    latest_ms: number
}


const PATTERN_PROJECT_PRIORITY = "p10"
export const get_priorities = (state: RootState): Priorities => {

    const raw_project_priorities = state.objects.filter(({ pattern_id }) => pattern_id === PATTERN_PROJECT_PRIORITY)

    let earliest_ms = new Date().getTime()
    let latest_ms = earliest_ms + 1

    const project_priorities: ProjectPriority[] = []
    raw_project_priorities.forEach(project_priority => {
        const { attributes } = project_priority

        const start_date = new Date((attributes[1] as CoreObjectValueAttribute).value)
        const project_id = (attributes[0] as CoreObjectIdAttribute).id
        const project = state.objects.find(({ id }) => id === project_id)

        if (!project) return

        const start_time_ms = start_date.getTime()
        if (Number.isNaN(start_time_ms)) return

        earliest_ms = Math.min(earliest_ms, start_time_ms)
        latest_ms = Math.max(latest_ms, start_time_ms)

        const effort_value = (attributes[2] as CoreObjectValueAttribute).value

        project_priorities.push({
            start_date,
            name: (project.attributes[0] as CoreObjectValueAttribute).value,
            id: project_priority.id,
            project_id: project.id,
            fields: [{ name: "Effort", value: effort_value }]
        })
    })

    return {
        project_priorities,
        earliest_ms,
        latest_ms,
    }
}
