import { h } from "preact"

import "./App.css"
import { MainArea } from "./layout/MainArea"
import { SidePanel } from "./layout/SidePanel"


function App() {

  return (
    <div className="App">
      <div id="main_area"><MainArea /></div>
      <div id="side_panel"><SidePanel /></div>
    </div>
  )
}

export default App
