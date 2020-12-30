import { createStore, Action, Reducer, AnyAction, Store } from "redux"

import { statements_reducer, statement_actions } from "./statements"
import { patterns_reducer, pattern_actions } from "./patterns"
import type { Objekt, Pattern, RootState, Statement } from "./State"
import {
    get_current_route_params,
    parse_url_for_routing_params,
    routing_reducer,
    routing_actions,
} from "./routing"
import { ActionKeyDownArgs, global_key_press_actions, global_key_press_reducer } from "./global_key_press"
import { CORE_IDS, STATEMENT_IDS } from "./core_data"


const KEY_FOR_LOCAL_STORAGE_STATE = "state"


function get_default_state (): RootState
{
    const datetime_created = new Date("2020-12-22")

    const statements: Statement[] = Object.keys(STATEMENT_IDS).map(handle => ({
        id: (STATEMENT_IDS as any)[handle],
        content: handle,
        datetime_created,
        labels: [CORE_IDS.Type],  // All are given label of type
    }))

    const patterns: Pattern[] = [
        {
            id: CORE_IDS.Person,
            datetime_created,
            name: "Person",
            content: `@@0 @@1`,
            attributes: [
                { type_id: "", alt_name: "First name" },
                { type_id: "", alt_name: "Last name" },
            ]
        },
        {
            id: CORE_IDS.Group,
            datetime_created,
            name: "Group",
            content: `@@0`,
            attributes: [
                { type_id: "", alt_name: "Group" },
                // TO DO: add more fields like URL, physical address etc
            ]
        },
        {
            id: CORE_IDS["Person(s) or Group(s)"],
            datetime_created,
            name: "Person(s) or Group(s)",
            content: "${a[0].join(', ')}${(a[0].length && a[1].length) ? ', ' : ''}${a[1].join(', ')}",
            attributes: [
                { type_id: CORE_IDS["Person"], alt_name: "Person(s)", multiple: true },
                { type_id: CORE_IDS["Group"], alt_name: "Group(s)", multiple: true },
            ]
        },
        {
            id: CORE_IDS["Date"],
            datetime_created,
            name: "Date",
            content: "@@c(0)-c(1)-c(2) c(3):c(4):c(5) UTC",
            attributes: [
                { type_id: CORE_IDS.Year, alt_name: "" },
                { type_id: CORE_IDS["Month of year"], alt_name: "" },
                { type_id: CORE_IDS["Day of month"], alt_name: "" },
                { type_id: CORE_IDS["Hour of day"], alt_name: "" },
                { type_id: CORE_IDS["Minute of hour"], alt_name: "" },
                { type_id: CORE_IDS["Seconds of minute"], alt_name: "" },
            ]
        },
        {
            id: CORE_IDS["Short date"],
            datetime_created,
            name: "Short Date",
            content: "@@c(0.0)-c(0.1)-c(0.2)",
            attributes: [
                { type_id: CORE_IDS.Date, alt_name: "" },
            ]
        },
        {
            id: CORE_IDS["Document"],
            datetime_created,
            name: "Document",
            content: `"@@a[0].content + ' - ' + a[1].content + ', ' + a[2].content"`,
            attributes: [
                { type_id: "", alt_name: "Title" },
                { type_id: CORE_IDS["Person(s) or Group(s)"], alt_name: "Author(s)" },
                { type_id: CORE_IDS["Short date"], alt_name: "Published date" },
                { type_id: CORE_IDS.URL, alt_name: "" },
                { type_id: CORE_IDS.DOI, alt_name: "" },
            ]
        },
    ]

    statements.push({
        id: "1000",
        datetime_created,
        content: "Coronavirus disease (COVID-19): Herd immunity, lockdowns and COVID-19",
        labels: [],
    })
    statements.push({
        id: "1001",
        datetime_created,
        content: "WHO",
        labels: [CORE_IDS.Group],
    })
    statements.push({
        id: "1002",
        datetime_created,
        content: "2020",
        labels: [CORE_IDS.Year],
    })
    statements.push({
        id: "1003",
        datetime_created,
        content: "https://www.who.int/news-room/q-a-detail/herd-immunity-lockdowns-and-covid-19",
        labels: [CORE_IDS.URL],
    })


    const objects: Objekt[] = [
        {
            id: "o0",
            datetime_created,
            pattern_id: CORE_IDS["Group"],
            content: "@@c(0)",
            pattern_name: "Group",
            attributes: [
                { tid: "", id: "1001" }
            ],
            labels: [],
        },
        {
            id: "o1",
            datetime_created,
            pattern_id: CORE_IDS["Date"],
            content: "@@c(0)-c(1)-c(2) c(3):c(4):c(5) UTC",
            pattern_name: "Date",
            attributes: [
                { tid: CORE_IDS.Year, id: "1002" },
                { tid: CORE_IDS["Month of year"], value: "10" },
                { tid: CORE_IDS["Day of month"], value: "15" },
                { tid: CORE_IDS["Hour of day"] },
                { tid: CORE_IDS["Minute of hour"] },
                { tid: CORE_IDS["Seconds of minute"] },
            ],
            labels: [],
        },
        {
            id: "o2",
            datetime_created,
            pattern_id: CORE_IDS["Short date"],
            content: "@@c(0.0)-c(0.1)-c(0.2)",
            pattern_name: "Short date",
            attributes: [
                { tid: CORE_IDS.Date, id: "o1" },
            ],
            labels: [],
        },
        {
            id: "o3",
            datetime_created,
            pattern_id: CORE_IDS.Document,
            content: "@@c(0) - c(1), c(2)",
            pattern_name: "Document",
            attributes: [
                { tid: "", id: "1000" },
                { tid: CORE_IDS["Person(s) or Group(s)"], id: "1001" },
                { tid: CORE_IDS["Short date"], id: "o2" },
                { tid: CORE_IDS.URL, id: "1003" },
                { tid: CORE_IDS.DOI, id: "" },
            ],
            labels: [],
        }
    ]

    let starting_state: RootState = {
        statements,
        patterns,
        objects,
        routing: get_current_route_params(),
        global_key_press: { last_key: undefined, last_key_time_stamp: undefined },
    }


    const state_str = 1 ? "" : localStorage.getItem(KEY_FOR_LOCAL_STORAGE_STATE)

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


const root_reducer: Reducer<RootState, any> = ((state: RootState, action: AnyAction) =>
{
    state = patterns_reducer(state, action)
    state = statements_reducer(state, action)
    state = routing_reducer(state, action)
    state = global_key_press_reducer(state, action)

    return state
}) as any


let store: Store<RootState, Action<any>>
export function config_store (use_cache: boolean = true, preloaded_state: Partial<RootState> | undefined = undefined)
{
    if (store && use_cache) return store

    const preloaded: RootState = {
        ...get_default_state(),
        ...(preloaded_state || {})
    }
    store = createStore<RootState, Action, {}, {}>(root_reducer, preloaded)

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
