import { h } from "preact"
import { Tab } from "./Tab"


interface TabsContainerProps
{
    content_changed: () => void
}


export function TabsContainer (props: TabsContainerProps)
{
    setTimeout(() => props.content_changed(), 0) // remove hack

    return <div>
        <Tab id="filter" />
        <Tab id="statements" />
        <Tab id="objects" />
        <Tab id="patterns" />
        <Tab id="creation_context" />
    </div>
}
