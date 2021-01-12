import type { Dispatch } from "redux"

import {
    CoreObject,
    CoreObjectAttribute,
    is_id_attribute,
    ObjectAttribute,
    ObjectWithCache,
    Pattern,
    RootState,
    Statement,
} from "./State"
import { ACTIONS } from "./actions"


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

        Object.keys(data).forEach(k => {
            if (!supported_keys.includes(k as any)) throw new Error(`Unexpected key "${k}" in state from server`)
        })

        let statements: Statement[] = data.statements
        let patterns: Pattern[] = data.patterns
        let objects: ObjectWithCache[] = data.objects

        if (!statements) throw new Error(`Expecting statements from server`)
        if (!patterns) throw new Error(`Expecting patterns from server`)
        if (!objects) throw new Error(`Expecting objects from server`)

        statements = parse_datetimes(statements)
        patterns = parse_datetimes(patterns)
        objects = parse_datetimes(objects)

        dispatch(ACTIONS.replace_all_statements({ statements }))
        dispatch(ACTIONS.replace_all_patterns({ patterns }))
        dispatch(ACTIONS.replace_all_core_objects({ objects }))
        dispatch(ACTIONS.update_sync_status(undefined))
    })
}


function parse_datetimes<T extends { datetime_created: Date }> (items: T[]): T[]
{
    return items.map(i => ({ ...i, datetime_created: new Date(i.datetime_created) }))
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
        objects: state.objects.map(convert_object_to_core),
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


function convert_object_to_core (object: ObjectWithCache): CoreObject
{
    return {
        id: object.id,
        datetime_created: object.datetime_created,
        labels: object.labels,
        attributes: object.attributes.map(convert_attribute_to_core),
        pattern_id: object.pattern_id,
        external_ids: object.external_ids,
    }
}

function convert_attribute_to_core (attribute: ObjectAttribute): CoreObjectAttribute
{
    if (is_id_attribute(attribute))
    {
        return {
            pidx: attribute.pidx,
            id: attribute.id,
        }
    }

    return {
        pidx: attribute.pidx,
        value: attribute.value,
    }
}
