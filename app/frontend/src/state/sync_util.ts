import type { Dispatch } from "redux"

import type { RootState } from "./State"
import { ACTIONS } from "./store"


const supported_keys: (keyof RootState)[] = [
    "statements",
    "patterns",
    "objects",
    "sync",
    "routing",
    "global_key_press",
]


export function load_state (dispatch: Dispatch)
{
    dispatch(ACTIONS.update_sync_status("LOADING"))

    fetch("http://localhost:4000/api/v1/state/", {
        method: "get",
    })
    .then(resp => resp.json())
    .then(data => {
        const state_to_load = {
            statements: data.statements,
            patterns: data.patterns,
            objects: data.objects,
        }
        Object.keys(data).forEach(k => {
            if (!supported_keys.includes(k as any)) throw new Error(`Unexpected key "${k}" in state from server`)
        })

        if (!data.statements) throw new Error(`Expecting statements from server`)
        if (!data.patterns) throw new Error(`Expecting patterns from server`)
        if (!data.objects) throw new Error(`Expecting objects from server`)

        dispatch(ACTIONS.replace_all_statements({ statements: data.statements }))
        dispatch(ACTIONS.replace_all_patterns({ patterns: data.patterns }))
        dispatch(ACTIONS.replace_all_objects({ objects: data.objects }))
        dispatch(ACTIONS.update_sync_status(undefined))
    })
}


let last_saved: RootState | undefined = undefined
export function save_state (dispatch: Dispatch, state: RootState)
{
    if (!needs_save(state, last_saved)) return

    last_saved = state
    dispatch(ACTIONS.update_sync_status("SAVING"))

    const state_to_save = {
        statements: state.statements,
        patterns: state.patterns,
        objects: state.objects,
    }
    Object.keys(state).forEach(k => {
        if (!supported_keys.includes(k as any)) throw new Error(`Unexpected key "${k}" in state to save`)
    })

    const state_str = JSON.stringify(state_to_save)
    fetch("http://localhost:4000/api/v1/state/", {
        method: "post",
        body: state_str,
    })
    .then(() => dispatch(ACTIONS.update_sync_status(undefined)))
}


function needs_save (state: RootState, last_saved: RootState | undefined)
{
    return (!last_saved ||
        state.statements !== last_saved.statements ||
        state.patterns !== last_saved.patterns ||
        state.objects !== last_saved.objects
    )
}
