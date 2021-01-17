import { h } from "preact"

import "./App.css"
import { MainArea } from "./layout/MainArea"
import { TabsContainer } from "./layout/TabsContainer"
import { SidePanel } from "./side_panel/SidePanel"


function App() {

  return (
    <div className="App">
      <div id="main_area"><MainArea /></div>
      <div id="side_panel">
        <TabsContainer content_changed={() => {}} />
        <div id="side_panel_content"><SidePanel /></div>
      </div>
    </div>
  )
}

export default App
