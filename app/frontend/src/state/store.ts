import { createStore, Action, Reducer, AnyAction } from "redux"

import { statements_reducer, statement_actions } from "./statements"
import { patterns_reducer, pattern_actions } from "./patterns"
import type { Pattern, RootState, Statement } from "./State"
import {
    get_current_route_params,
    parse_url_for_routing_params,
    routing_reducer,
    routing_actions,
} from "./routing"
import { ActionKeyDownArgs, global_key_press_actions, global_key_press_reducer } from "./global_key_press"
import { CORE_IDS } from "./core_data"


const KEY_FOR_LOCAL_STORAGE_STATE = "state"


function get_default_state (): RootState
{
    const datetime_created = new Date("2020-12-22")

    const statement_contents: {[id: string]: string} = {
        [CORE_IDS.Type]: "Type",
        [CORE_IDS.Title]: "Title",
        [CORE_IDS.DOI]: "DOI",
        [CORE_IDS.URL]: "URL",
    }
    const statements: Statement[] = Object.keys(statement_contents).map(id => ({
        id,
        content: statement_contents[id],
        datetime_created,
        labels: [CORE_IDS.Type],  // All are given label of type
    }))

    const patterns: Pattern[] = [
        {
            id: CORE_IDS.Author,
            datetime_created: datetime_created,
            name: "Author",
            content: `@@0 @@1`,
            attributes: [
                { type_id: CORE_IDS["First name"], alt_name: "" },
                { type_id: CORE_IDS["Last name"], alt_name: "" },
            ]
        },
        {
            id: CORE_IDS.Authors,
            datetime_created: datetime_created,
            name: "Authors",
            content: "@@0",
            attributes: [
                { type_id: CORE_IDS["Author"], alt_name: "Authors", multiple: true },
            ]
        },
        {
            id: CORE_IDS.Group,
            datetime_created: datetime_created,
            name: "Group",
            content: `@@0`,
            attributes: [
                { type_id: "", alt_name: "Group" },
            ]
        },
        {
            id: CORE_IDS["Author(s) or Group"],
            datetime_created: datetime_created,
            name: "Author(s) or Group",
            content: `@@0@@1`,
            attributes: [
                { type_id: CORE_IDS["Authors"], alt_name: "" },
                { type_id: CORE_IDS["Group"], alt_name: "" },
            ]
        },
        {
            id: CORE_IDS["Document"],
            datetime_created: datetime_created,
            name: "Document",
            content: `@@0 from @@1`,
            attributes: [
                { type_id: CORE_IDS.Title, alt_name: "" },
                { type_id: CORE_IDS["Author(s) or Group"], alt_name: "" },
            ]
        },
    ]

    let starting_state: RootState = {
        statements,
        patterns,
        objects: [],
        routing: get_current_route_params(),
        global_key_press: { last_key: undefined, last_key_time_stamp: undefined },
    }

    const state_str = localStorage.getItem(KEY_FOR_LOCAL_STORAGE_STATE)
    // if (state_str)
    // {
        // const saved_state = JSON.parse(state_str)
        // const expected_keys = new Set(Object.keys(starting_state))
        // const saved_keys = new Set(Object.keys(saved_state))

        // const extra_keys = Array.from(saved_keys).filter(ek => !expected_keys.has(ek))
        // if (extra_keys.length) console.warn(`Extra ${extra_keys.length} keys: ${extra_keys}`)

        // const missing_keys = Array.from(expected_keys).filter(ek => !saved_keys.has(ek))
        // if (missing_keys.length)
        // {
        //     console.error(`Missing ${missing_keys.length} keys: ${missing_keys}`)
        // }
        // else
        // {
        //     const routing = starting_state.routing
        //     starting_state = {
        //         ...saved_state,
        //         routing
        //     }
        // }
    // }

    return starting_state
}


const root_reducer: Reducer<RootState, any> = (state: RootState | undefined, action: AnyAction) =>
{
    state = state || get_default_state()

    state = patterns_reducer(state, action)
    state = statements_reducer(state, action)
    state = routing_reducer(state, action)
    state = global_key_press_reducer(state, action)

    return state
}


export function config_store ()
{
    const store = createStore<RootState, Action, {}, {}>(root_reducer)

    store.subscribe(() => {
        const state = store.getState()
        localStorage.setItem(KEY_FOR_LOCAL_STORAGE_STATE, JSON.stringify(state))
        ;(window as any).store_state = state
    })

    window.onhashchange = (e: HashChangeEvent) =>
    {
        const routing_params = parse_url_for_routing_params(e.newURL)
        store.dispatch(ACTIONS.change_route(routing_params))
    }

    document.onkeydown = (e) =>
    {
        const action_args: ActionKeyDownArgs = {
            time_stamp: e.timeStamp,
            alt_key: e.altKey,
            code: e.code,
            ctrl_key: e.ctrlKey,
            key: e.key,
            meta_key: e.metaKey,
            return_value: e.returnValue,
            shift_key: e.shiftKey,
        }

        store.dispatch(ACTIONS.key_down(action_args))
    }

    return store
}

export const ACTIONS =
{
    ...pattern_actions,
    ...statement_actions,
    ...routing_actions,
    ...global_key_press_actions,
}
