import { h } from "preact"
import { Provider } from "react-redux"

import { config_store } from "./state/store"
import "./App.css"
import { DemoCounter } from "./DemoCounter"


function App() {

  return (
    <Provider store={config_store()}>
      <div className="App">
        Content goes here
        <DemoCounter backgroundColor="#BDF" />
      </div>
    </Provider>
  )
}

export default App
