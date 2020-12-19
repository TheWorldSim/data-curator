import { h } from "preact"

import type { DesiredState } from "../state/State"


interface Props {
    desired_state: DesiredState
}


export function DesiredStateListEntry (props: Props)
{
    return <div>{props.desired_state.content}</div>
}
