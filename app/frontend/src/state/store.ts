import { createStore, Action, Reducer, AnyAction, Store } from "redux"

import { statements_reducer, statement_actions } from "./statements"
import { patterns_reducer, pattern_actions } from "./patterns"
import type { RootState } from "./State"
import {
    parse_url_for_routing_params,
    routing_reducer,
    routing_actions,
} from "./routing"
import { ActionKeyDownArgs, global_key_press_actions, global_key_press_reducer } from "./global_key_press"
import { object_actions, objects_reducer } from "./objects"
import { render_object } from "../objects/object_content"
import { get_starting_state } from "./starting_state"


const KEY_FOR_LOCAL_STORAGE_STATE = "state"

function save_state (state: RootState)
{
    localStorage.setItem(KEY_FOR_LOCAL_STORAGE_STATE, JSON.stringify(state))
}


function get_initial_state (): RootState
{
    let starting_state = get_starting_state()

    const use_browser_state = 0
    const state_str = use_browser_state ? localStorage.getItem(KEY_FOR_LOCAL_STORAGE_STATE) : ""

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

    if (!use_browser_state) save_state(starting_state)

    return starting_state
}


const root_reducer: Reducer<RootState, any> = ((state: RootState, action: AnyAction) =>
{

    state = patterns_reducer(state, action)
    state = statements_reducer(state, action)
    state = routing_reducer(state, action)
    state = global_key_press_reducer(state, action)
    state = objects_reducer(state, action)

    return state
}) as any


let store: Store<RootState, Action<any>>
export function config_store (use_cache: boolean = true, override_preloaded_state: Partial<RootState> | undefined = undefined)
{
    if (store && use_cache) return store

    const preloaded_state: RootState = render_all_objects({
        ...get_initial_state(),
        ...(override_preloaded_state || {})
    })
    store = createStore<RootState, Action, {}, {}>(root_reducer, preloaded_state)

    store.subscribe(() =>
    {
        const state = store.getState()
        save_state(state)
        ;(window as any).store_state = state
    })

    store.subscribe(render_all_objects_and_update_store)

    window.onhashchange = (e: HashChangeEvent) =>
    {
        const routing_params = parse_url_for_routing_params({ url: e.newURL, state: store.getState() })
        store.dispatch(ACTIONS.change_route(routing_params))
    }

    window.onbeforeunload = () =>
    {
        const state = store.getState()
        delete (state as any).routing
        delete (state as any).global_key_press
        const backup_state = JSON.stringify(state)
        fetch("http://localhost:4000/api/v1/save_state/", {
            method: "post",
            body: backup_state,
        })
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


function render_all_objects_and_update_store ()
{
    const state = store.getState()

    const { objects } = render_all_objects(state)

    if (objects !== state.objects)
    {
        store.dispatch(ACTIONS.replace_all_objects({ objects }))
    }
}


function render_all_objects (state: RootState): RootState
{
    let updated_one_or_more = false

    const updated_objects = state.objects.map(object => {
        if (!object.needs_rendering) return object

        updated_one_or_more = true

        const rendered = render_object({ object, state })
        return {
            ...object,
            rendered,
            needs_rendering: false,
        }
    })

    if (!updated_one_or_more) return state

    return {
        ...state,
        objects: updated_objects,
    }
}


export const ACTIONS =
{
    ...pattern_actions,
    ...statement_actions,
    ...object_actions,
    ...routing_actions,
    ...global_key_press_actions,
}
