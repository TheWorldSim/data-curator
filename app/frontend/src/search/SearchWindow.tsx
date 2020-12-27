import { h } from "preact"
import "./SearchWindow.css"


interface Props
{
    on_change: (value: string) => void
    on_close: () => void
}


export function SearchWindow (props: Props)
{
    return <div id="search_background">
        <div id="search_box">
            Search
            <div id="search_close" onClick={() => props.on_close()}><span>X</span></div>
        </div>
    </div>
}
