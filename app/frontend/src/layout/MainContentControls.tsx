import { h } from "preact"
import { ProjectEvent, TimeSlider } from "../time_control/TimeSlider"


export function MainContentControls ()
{
    const events: ProjectEvent[] = [
    ]

    return <div>
        <TimeSlider events={events}/>
    </div>
}
