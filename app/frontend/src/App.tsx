import { h } from "preact"
import { useState, useCallback } from "preact/hooks"
import "./App.css"
import { NewStatementForm } from "./statements/NewStatementForm"
import { StatementsList } from "./statements/StatementsList"
import type { DesiredState, State, Statement } from "./state/State"
import { ManuallySaveState } from "./state/ManuallySaveState"
import { MainArea } from "./layout/MainArea"
import { SidePanel } from "./layout/SidePanel"


function load_state (): State
{
  const state_str = localStorage.getItem("state") || `{}`
  const state = JSON.parse(state_str)
  state.statements = state.statements || []
  state.desired_states = state.desired_states || []

  return state
}


function init_existing_state (state: State)
{
  const [statements, setValue] = useState(state.statements)
  const create_statement = useCallback((new_statement_content: string) => {
    const new_statement: Statement = {
      id: Math.random().toString().slice(2),
      content: new_statement_content,
    }

    setValue([new_statement, ...statements])
  }, [statements])

  const delete_statement = useCallback((id: string) => {
    const filtered_statements = statements.filter(s => s.id !== id)
    setValue(filtered_statements)
  }, [statements])

  return { statements, create_statement, delete_statement }
}


function init_desired_state (state: State)
{
  const [desired_states, setValue] = useState(state.desired_states)
  const create_desired_state = useCallback((new_desired_state_content: string) => {
    const new_desired_state: DesiredState = {
      id: Math.random().toString().slice(2),
      content: new_desired_state_content,
    }

    setValue([new_desired_state, ...desired_states])
  }, [desired_states])

  const delete_desired_state = useCallback((id: string) => {
    const filtered_desired_states = desired_states.filter(s => s.id !== id)
    setValue(filtered_desired_states)
  }, [desired_states])

  return { desired_states, create_desired_state, delete_desired_state }
}


function App() {
  let state = load_state()

  const { statements, create_statement, delete_statement } = init_existing_state(state)
  const { desired_states, create_desired_state, delete_desired_state } = init_desired_state(state)

  state = { statements, desired_states }

  ;(function save_state () {
    localStorage.setItem("state", JSON.stringify(state))
  }())


  return (
    <div className="App">
      <div id="main_area"><MainArea /></div>
      <div id="side_panel"><SidePanel /></div>
      {/* Add statements:
      <NewStatementForm create_statement={create_statement} />
      <StatementsList statements={statements} delete_statement={delete_statement} />

      Add desired state:
      <NewStatementForm create_statement={create_desired_state} />
      <StatementsList statements={desired_states} delete_statement={delete_desired_state} /> */}

      {/* <input type="range" style={{ width: 800 }}></input> */}
      {/* <ManuallySaveState state={state} /> */}
    </div>
  )
}

export default App
