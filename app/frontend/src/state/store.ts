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


const KEY_FOR_LOCAL_STORAGE_STATE = "state"


function get_default_state (): RootState
{
    const datetime_created = new Date("2020-12-22")
    const ids = {
        Type: "0",
        Title: "1",
        DOI: "2",
        URL: "3",
        "First name": "4",
        "Last name": "5",

        Author: "P0",
        Authors: "P1",
        Group: "P2",
        "Author(s) or Group": "P3",
        Document: "P4",
    }
    const statement_contents: {[id: string]: string} = {
        [ids.Type]: "Type",
        [ids.Title]: "Title",
        [ids.DOI]: "DOI",
        [ids.URL]: "URL",
    }
    const statements: Statement[] = Object.keys(statement_contents).map(id => ({
        id,
        content: statement_contents[id],
        datetime_created,
        labels: [ids.Type],  // All are given label of type
    }))

    const patterns: Pattern[] = [
        {
            id: ids.Author,
            datetime_created: datetime_created,
            name: "Author",
            content: `@@0 @@1`,
            attributes: [
                { statement_type_id: ids["First name"], alt_name: "" },
                { statement_type_id: ids["Last name"], alt_name: "" },
            ]
        },
        {
            id: ids.Authors,
            datetime_created: datetime_created,
            name: "Authors",
            content: "@@0",
            attributes: [
                { statement_type_id: ids["Author"], alt_name: "Authors", multiple: true },
            ]
        },
        {
            id: ids.Group,
            datetime_created: datetime_created,
            name: "Group",
            content: `@@0`,
            attributes: [
                { statement_type_id: "", alt_name: "Group" },
            ]
        },
        {
            id: ids["Author(s) or Group"],
            datetime_created: datetime_created,
            name: "Author(s) or Group",
            content: `@@0@@1`,
            attributes: [
                { statement_type_id: ids["Authors"], alt_name: "" },
                { statement_type_id: ids["Group"], alt_name: "" },
            ]
        },
        {
            id: ids["Document"],
            datetime_created: datetime_created,
            name: "Document",
            content: `@@0 from @@1`,
            attributes: [
                { statement_type_id: ids.Title, alt_name: "" },
                { statement_type_id: ids["Author(s) or Group"], alt_name: "" },
            ]
        },
    ]

    let starting_state: RootState = {
        statements,
        patterns,
        objects: [],
        routing: get_current_route_params(),
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

    return state
}


export function config_store ()
{
    const store = createStore<RootState, Action, {}, {}>(root_reducer)

    store.subscribe(() => {
        const state = store.getState()
        localStorage.setItem(KEY_FOR_LOCAL_STORAGE_STATE, JSON.stringify(state))
    })

    window.onhashchange = (e: HashChangeEvent) =>
    {
        const routing_params = parse_url_for_routing_params(e.newURL)
        store.dispatch(ACTIONS.change_route(routing_params))
    }

    return store
}

export const ACTIONS =
{
    ...pattern_actions,
    ...statement_actions,
    ...routing_actions,
}
