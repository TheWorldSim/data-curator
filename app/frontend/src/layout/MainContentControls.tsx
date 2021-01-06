import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { CoreObjectIdAttribute, CoreObjectValueAttribute, RootState } from "../state/State"
import { EventObject, TimeSlider } from "../time_control/TimeSlider"


interface OwnProps {}


const PATTERN_PROJECT_PRIORITY = "p10"
const PATTERN_EVENT = "p12"
const map_state = (state: RootState) => {

    const priorities = state.objects.filter(({ pattern_id }) => pattern_id === PATTERN_PROJECT_PRIORITY)

    let earliest_ms: number = Number.POSITIVE_INFINITY
    let latest_ms: number = Number.NEGATIVE_INFINITY

    const events: EventObject[] = []
    priorities.forEach(({ attributes }) => {
        const start_date = new Date((attributes[1] as CoreObjectValueAttribute).value)
        const project_id = (attributes[0] as CoreObjectIdAttribute).id
        const project = state.objects.find(({ id }) => id === project_id)

        if (!project) return

        const start_time_ms = start_date.getTime()
        if (Number.isNaN(start_time_ms)) return

        earliest_ms = Math.min(earliest_ms, start_time_ms)
        latest_ms = Math.max(latest_ms, start_time_ms)

        events.push({
            start_date,
            name: (project.attributes[0] as CoreObjectValueAttribute).value,
            object_id: project.id,
        })
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
