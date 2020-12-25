import { createStore, Action, Reducer, AnyAction } from "redux"
import { statements_reducer, statement_actions } from "./statements"
import { patterns_reducer, pattern_actions } from "./patterns"
import type { RootState, Statement } from "./State"
import { get_current_route, routing_reducer, routing_actions } from "./routing"


const KEY_FOR_LOCAL_STORAGE_STATE = "state"


function get_default_state (): RootState
{
    const statement_contents = [
        "Type",  // leave this in position 0
        "Author",
        "Document",
        "DOI",
        "URL",
    ]
    const statements: Statement[] = statement_contents.map((content, i) => ({
        id: `${i}`,
        content,
        datetime_created: new Date("2020-12-22"),
        labels: ["0"],  // All are given label of type
    }))


    let starting_state: RootState = {
        statements,
        patterns: [],
        objects: [],
        routing: { route: get_current_route() },
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

    state = patterns_reducer(state, action)
    state = statements_reducer(state, action)
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
    ...pattern_actions,
    ...statement_actions,
    ...routing_actions,
}
