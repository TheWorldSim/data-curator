import { createStore, Action, Reducer, AnyAction, Store } from "redux"

import { ACTIONS } from "./actions"
import { current_datetime_reducer, periodically_update_current_datetime } from "./current_datetime"
import { global_key_press_reducer, ActionKeyDownArgs } from "./global_key_press"
import { objects_reducer } from "./objects/objects"
import { render_all_objects, render_all_objects_and_update_store } from "./objects/rendering"
import { patterns_reducer } from "./patterns"
import { routing_reducer, get_current_route_params } from "./routing/routing"
import { factory_update_location_hash } from "./routing/update_location_hash"
import { get_starting_state } from "./starting_state"
import type { RootState } from "./State"
import { statements_reducer } from "./statements"
import { sync_reducer } from "./sync"
import { load_state, save_state } from "./sync_util"


const root_reducer: Reducer<RootState, any> = ((state: RootState, action: AnyAction) =>
{

    state = statements_reducer(state, action)
    state = patterns_reducer(state, action)
    state = objects_reducer(state, action)
    state = sync_reducer(state, action)
    state = routing_reducer(state, action)
    state = global_key_press_reducer(state, action)
    state = current_datetime_reducer(state, action)

    // console.log(action.type, action)

    return state
}) as any


let cached_store: Store<RootState, Action<any>>

interface ConfigStoreArgs
{
    use_cache?: boolean
    override_preloaded_state?: Partial<RootState> | undefined
    load_state_from_server?: boolean
}
export function config_store (args: ConfigStoreArgs = {})
{
    let { use_cache, override_preloaded_state, load_state_from_server } = args

    use_cache = use_cache === undefined ? true : use_cache
    if (cached_store && use_cache) return cached_store


    override_preloaded_state = override_preloaded_state || {}
    const preloaded_state: RootState = render_all_objects({
        ...get_starting_state(),
        ...override_preloaded_state,
    })
    const store = createStore<RootState, Action, {}, {}>(root_reducer, preloaded_state)
    cached_store = store


    load_state_from_server = load_state_from_server === undefined ? false : load_state_from_server
    if (load_state_from_server) load_state(store.dispatch)


    const save = () =>
    {
        const state = store.getState()
        ;(window as any).debug_state = state
        if (!state.sync.ready) return
        save_state(store.dispatch, state)
    }
    store.subscribe(save)
    window.onbeforeunload = save


    store.subscribe(render_all_objects_and_update_store(store))

    store.subscribe(factory_update_location_hash(store))

    periodically_update_current_datetime(store)

    /**
     * Update the route to reflect any manual change of the hash route by the user
     * editing the url, or by pressing the navigation buttons.
     * Or from when the page first loads and the route changes then.
     */
    let promise_state_ready: Promise<void>
    window.onhashchange = () =>
    {
        const state = store.getState()
        if (!state.sync.ready)
        {
            if (promise_state_ready) return
            promise_state_ready = new Promise<void>(resolve =>
            {
                const unsubscribe = store.subscribe(() => {
                    unsubscribe()
                    resolve()
                })
            })
            .then(() =>
            {
                const routing_params = get_current_route_params(store.getState())
                store.dispatch(ACTIONS.change_route(routing_params))
            })

            return
        }

        const routing_params = get_current_route_params(store.getState())
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
