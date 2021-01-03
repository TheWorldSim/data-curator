import { h } from "preact"


interface OwnProps
{
    events: ProjectEvent[]
}

export interface ProjectEvent
{
    start: Date
    stop?: Date
    title: string
    description?: string
}


export function TimeSlider (props: OwnProps)
{
    return <div>
        {props.events.length} events
    </div>
}
