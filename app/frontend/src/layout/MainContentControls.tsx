import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { CoreObjectValueAttribute, RootState } from "../state/State"
import { TimeSlider } from "../time_control/TimeSlider"


interface OwnProps {}


const PATTERN_EVENT = "p1980829678265834"
const map_state = (state: RootState) => {

    const events = state.objects.filter(({ pattern_id }) => pattern_id === PATTERN_EVENT)

    let earliest_ms: number = Number.POSITIVE_INFINITY
    let latest_ms: number = Number.NEGATIVE_INFINITY
    events.forEach(({ attributes }) => {
        const epoch = new Date((attributes[1] as CoreObjectValueAttribute).value).getTime()

        earliest_ms = Math.min(earliest_ms, epoch)
        latest_ms = Math.max(latest_ms, epoch)
    })

    if (!Number.isFinite(earliest_ms))
    {
        earliest_ms = 0
        latest_ms = 1
    }

    return {
        events,
        earliest_ms,
        latest_ms,
    }
}


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps


function _MainContentControls (props: Props)
{
    return <div>
        <TimeSlider earliest_ms={props.earliest_ms} latest_ms={props.latest_ms} events={props.events} />
    </div>
}


export const MainContentControls = connector(_MainContentControls) as FunctionalComponent<OwnProps>
