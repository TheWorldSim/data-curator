import type { DailyActionNodeProps } from "../../canvas/interfaces"
import { x_factory, calc_width, action_y, action_height, MSECONDS_PER_DAY } from "../display"
import type { DailyActionsMeta, ProjectIdToVerticalPosition } from "../interfaces"


interface ConvertActionsToNodesArgs
{
    daily_actions_meta: DailyActionsMeta
    display_at_datetime_ms: number
    origin_ms: number
    project_id_to_vertical_position: ProjectIdToVerticalPosition
}
export function convert_daily_actions_to_nodes (args: ConvertActionsToNodesArgs): DailyActionNodeProps[]
{
    const {
        daily_actions_meta,
        display_at_datetime_ms,
        origin_ms,
        project_id_to_vertical_position,
    } = args

    const x = x_factory(origin_ms)
    const width = calc_width(0, MSECONDS_PER_DAY)

    const nodes: DailyActionNodeProps[] = []

    Object.keys(daily_actions_meta).forEach(project_id =>
    {
        const project_actions = daily_actions_meta[project_id]
        const vertical_position = project_id_to_vertical_position[project_id]

        Object.keys(project_actions).sort().forEach(date_str =>
        {
            const a = project_actions[date_str]

            const date = new Date(date_str)
            const date_ms = date.getTime()
            const display = date_ms <= display_at_datetime_ms

            const node: DailyActionNodeProps = {
                x: x(date_ms),
                y: action_y(vertical_position),
                width,
                height: action_height,
                display,
                action_ids: a.action_ids,
            }

            nodes.push(node)
        })

    })

    return nodes
}
