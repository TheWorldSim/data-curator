import { h } from "preact"
import { useState } from "preact/hooks"


interface TabsContainerProps
{
    content_changed: () => void
}


export function TabsContainer (props: TabsContainerProps)
{
    setTimeout(() => props.content_changed(), 0) // remove hack

    return <div>
        TabsContainer
    </div>
}
