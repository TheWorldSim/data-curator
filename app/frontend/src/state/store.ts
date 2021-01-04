import { createStore, Action, Reducer, AnyAction, Store } from "redux"

import { statements_reducer, statement_actions } from "./statements"
import { patterns_reducer } from "./patterns"
import { pattern_actions } from "./pattern_actions"
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
import { sync_actions, sync_reducer } from "./sync"
import { load_state, save_state } from "./sync_util"


const root_reducer: Reducer<RootState, any> = ((state: RootState, action: AnyAction) =>
{

    state = statements_reducer(state, action)
    state = patterns_reducer(state, action)
    state = objects_reducer(state, action)
    state = sync_reducer(state, action)
    state = routing_reducer(state, action)
    state = global_key_press_reducer(state, action)

    console.log(action.type, action)

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
        ...override_preloaded_state
    })
    const store = createStore<RootState, Action, {}, {}>(root_reducer, preloaded_state)
    cached_store = store


    load_state_from_server = load_state_from_server === undefined ? false : load_state_from_server
    if (load_state_from_server) load_state(store.dispatch)


    const save = () =>
    {
        const state = store.getState()
        if (!state.sync.ready) return
        save_state(store.dispatch, state)
    }
    store.subscribe(save)
    window.onbeforeunload = save


    store.subscribe(render_all_objects_and_update_store(store))


    window.onhashchange = (e: HashChangeEvent) =>
    {
        const routing_params = parse_url_for_routing_params({ url: e.newURL, state: store.getState() })
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


function render_all_objects_and_update_store (store: Store)
{
    return () =>
    {
        const state = store.getState()

        const { objects } = render_all_objects(state)

        if (objects !== state.objects)
        {
            store.dispatch(ACTIONS.replace_all_objects_with_cache({ objects }))
        }
    }
}


function render_all_objects (state: RootState): RootState
{
    let updated_one_or_more = false

    const updated_objects = state.objects.map(object => {
        if (object.is_rendered) return object

        updated_one_or_more = true

        const rendered = render_object({ object, state })
        return {
            ...object,
            rendered,
            is_rendered: true,
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
    ...sync_actions,
    ...routing_actions,
    ...global_key_press_actions,
}
