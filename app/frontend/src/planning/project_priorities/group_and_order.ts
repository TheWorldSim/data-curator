import type { ProjectPriority, ProjectPrioritiesByProjectId } from "../interfaces"


export function group_priorities_by_project (project_priorities: ProjectPriority[])
{
    const priorities_by_project: ProjectPrioritiesByProjectId = {}

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


export function order_priorities_by_project (priorities_by_project: ProjectPrioritiesByProjectId): ProjectPrioritiesByProjectId
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
