import { h } from "preact"
import { useState, useCallback } from "preact/hooks"
import "./App.css"
import { NewStatementForm } from "./statements/NewStatementForm"
import { StatementsList } from "./statements/StatementsList"
import type { State, Statement } from "./State"


function load_state (): State
{
  const state = localStorage.getItem("state") || `{ "statements": [] }`
  const { statements } = JSON.parse(state)

  return { statements }
}


function App() {
  const state = load_state()

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


  ;(function save_state () {
    const state: State = { statements }
    localStorage.setItem("state", JSON.stringify(state))
  }())


  return (
    <div className="App">
      Add statements:
      <NewStatementForm create_statement={create_statement} />
      <StatementsList statements={statements} delete_statement={delete_statement} />
      <StatementsList statements={statements} format="json" />
    </div>
  )
}

export default App
