import { h } from "preact"

import { MainContent } from "./MainContent"
import { MainContentControls } from "./MainContentControls"


export function MainArea ()
{
    return <div>
        <div id="main_content" style={{ padding: "5px 5px 5px 0" }}>
            <MainContent />
        </div>
        <div id="main_content_controls">
            <MainContentControls />
        </div>
    </div>
}
