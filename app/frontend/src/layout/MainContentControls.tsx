import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { get_priorities } from "../planning/get_priorities"
import type { RootState } from "../state/State"
import { TimeSlider } from "../time_control/TimeSlider"


interface OwnProps {}


const map_state = (state: RootState) => {
    return get_priorities(state)
}


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps


function _MainContentControls (props: Props)
{
    return <div>
        <TimeSlider earliest_ms={props.earliest_ms} latest_ms={props.latest_ms} events={props.project_priorities} />
    </div>
}


export const MainContentControls = connector(_MainContentControls) as FunctionalComponent<OwnProps>
