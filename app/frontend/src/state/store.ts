import { createStore, Action, Reducer, AnyAction } from "redux"
import { statements_reducer, statement_actions } from "./statements"
import type { RootState } from "./State"
import { desired_states_reducer, desired_state_actions } from "./desired_states"
import { get_current_route, routing_reducer, routing_actions } from "./routing"


const KEY_FOR_LOCAL_STORAGE_STATE = "state"


function get_default_state (): RootState
{
    let starting_state: RootState = {
        statements: [],
        desired_states: [],
        routing: { route: get_current_route() }
    }

    const state_str = localStorage.getItem(KEY_FOR_LOCAL_STORAGE_STATE)
    if (state_str)
    {
        const saved_state = JSON.parse(state_str)
        const expected_keys = new Set(Object.keys(starting_state))
        const saved_keys = new Set(Object.keys(saved_state))

        const extra_keys = Array.from(saved_keys).filter(ek => !expected_keys.has(ek))
        if (extra_keys.length) console.warn(`Extra ${extra_keys.length} keys: ${extra_keys}`)

        const missing_keys = Array.from(expected_keys).filter(ek => !saved_keys.has(ek))
        if (missing_keys.length)
        {
            console.error(`Missing ${missing_keys.length} keys: ${missing_keys}`)
        }
        else
        {
            const routing = starting_state.routing
            starting_state = {
                ...saved_state,
                routing
            }
        }
    }

    return starting_state
}


const root_reducer: Reducer<RootState, any> = (state: RootState | undefined, action: AnyAction) =>
{
    state = state || get_default_state()

    state = statements_reducer(state, action)
    state = desired_states_reducer(state, action)
    state = routing_reducer(state, action)

    return state
}


export function config_store ()
{
    const store = createStore<RootState, Action, {}, {}>(root_reducer)

    store.subscribe(() => {
        const state = store.getState()
        localStorage.setItem(KEY_FOR_LOCAL_STORAGE_STATE, JSON.stringify(state))
    })

    return store
}

export const ACTIONS =
{
    ...statement_actions,
    ...desired_state_actions,
    ...routing_actions,
}
