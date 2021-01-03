import { h, render } from "preact"
import "preact/devtools"
import { Provider } from "react-redux"

import App from "./App.js"
import "./index.css"
import { APP_DETAILS } from "./shared/constants.js"
import { config_store } from "./state/store.js"

const root = document.getElementById("root")
const title = document.getElementsByTagName("title")[0]

if (root) {
  render(<Provider store={config_store({ load_state_from_server: true })}><App /></Provider>, root)
}

if (title) {
  title.innerHTML = APP_DETAILS.NAME
}
