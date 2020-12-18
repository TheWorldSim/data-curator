import { h, render } from "preact"
import "preact/devtools"
import App from "./App.js"
import "./index.css"
import { APP_DETAILS } from "./shared/constants.js"

const root = document.getElementById("root")
const title = document.getElementsByTagName("title")[0]

if (root) {
  render(<App />, root)
}

if (title) {
  title.innerHTML = APP_DETAILS.NAME
}
