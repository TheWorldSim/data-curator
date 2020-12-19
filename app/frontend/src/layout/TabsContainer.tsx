import { h } from "preact"
import { useState } from "preact/hooks"


interface TabsContainerProps
{
    content_changed: () => void
}


export function TabsContainer (props: TabsContainerProps)
{
    console.log("rendering tabs container")

    const [toggle, set_toggle] = useState(false)

    setTimeout(() => set_toggle(!toggle), 1000)

    setTimeout(() => props.content_changed(), 0) // remove hack

    return <div>
        TabsContainer
        {toggle && <div>1<br /><br /><br /><br />3</div>}
    </div>
}
