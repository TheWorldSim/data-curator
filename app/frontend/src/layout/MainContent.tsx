import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { Canvas } from "../canvas/Canvas"
import { routing_args_to_datetime_ms } from "../state/routing/routing_datetime"
import type { RootState } from "../state/State"
import { convert_daily_actions_to_nodes } from "../planning/daily_actions/daily_actions_to_nodes"
import { get_daily_actions_meta } from "../planning/daily_actions/get_daily_actions"
import { get_project_priorities_meta } from "../planning/project_priorities/get_project_priorities"
import { convert_project_priorities_to_nodes, get_extent_of_content } from "../planning/project_priorities/project_priorities_to_nodes"
import { group_priorities_by_project, order_priorities_by_project } from "../planning/project_priorities/group_and_order"
import { get_project_id_to_vertical_position } from "../planning/project_priorities/vertical_position"


interface OwnProps {}


const map_state = (state: RootState) => {
    const display_at_datetime_ms = routing_args_to_datetime_ms(state)

    const {
        earliest_ms,
        project_priorities,
    } = get_project_priorities_meta(state)
    const unordered_priorities_by_project = group_priorities_by_project(project_priorities)
    const priorities_by_project = order_priorities_by_project(unordered_priorities_by_project)
    const project_priority_nodes = convert_project_priorities_to_nodes({
        priorities_by_project,
        display_at_datetime_ms,
        origin_ms: earliest_ms,
    })

    const daily_actions_meta = get_daily_actions_meta(state)
    const project_id_to_vertical_position = get_project_id_to_vertical_position(priorities_by_project)
    const daily_action_nodes = convert_daily_actions_to_nodes({
        daily_actions_meta,
        display_at_datetime_ms,
        origin_ms: earliest_ms,
        project_id_to_vertical_position,
    })

    const extent_of_content = get_extent_of_content(priorities_by_project)

    return {
        project_priority_nodes,
        daily_action_nodes,
        origin_ms: earliest_ms,
        extent_of_content,
    }
}


const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _MainContent (props: Props)
{
    return <div>
        <Canvas
            project_priority_node_props={props.project_priority_nodes}
            daily_action_node_props={props.daily_action_nodes}
            origin_ms={props.origin_ms}
            extent_of_content={props.extent_of_content}
        />
    </div>
}


export const MainContent = connector(_MainContent) as FunctionComponent<OwnProps>
