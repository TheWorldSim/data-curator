import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"
import { CORE_IDS } from "../state/core_data"

import { merge_pattern_attributes } from "../state/objects"
import type { ObjectWithCache, Pattern, RootState } from "../state/State"
import { ACTIONS } from "../state/store"
import { get_new_id } from "../utils/utils"


interface OwnProps {}


const map_state = (state: RootState) => {
    const action = state.patterns.find(({ id }) => id === CORE_IDS.Action)
    if (!action) throw new Error(`Pattern "Action" for id: ${CORE_IDS.Action} not found`)

    return {
        objects: state.objects,
        patterns: { action },
    }
}


const map_dispatch = {
    upsert_objects: (objects: ObjectWithCache[]) => ACTIONS.upsert_objects({ objects })
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


function _ObjectBulkImport (props: Props)
{
    const get_data = get_data_from_air_table(props.patterns.action, props.objects, props.upsert_objects)

    return <div>
        <b>Object Bulk Import</b>

        <br /><br />

        <hr />

        <b>Get AirTable data</b>

        <br /><br />

        <input type="button" value="Get data" onClick={get_data}></input>

    </div>
}


export const ObjectBulkImport = connector(_ObjectBulkImport) as FunctionComponent<OwnProps>


const external_id_key = "airtable"


function get_data_from_air_table (pattern: Pattern, existing_objects: ObjectWithCache[], upsert_objects: (objects: ObjectWithCache[]) => void)
{
    const auth_key = localStorage.getItem("airtable_auth_key")
    const app = localStorage.getItem("airtable_app")
    const table = localStorage.getItem("airtable_table")
    const view = localStorage.getItem("airtable_view")
    const url = `https://api.airtable.com/v0/${app}/${table}?maxRecords=100&view=${view}`

    return () =>
    {
        fetch(url, { headers: { "Authorization": `Bearer ${auth_key}` } })
        .then(d => d.json())
        .then((d: { records: AirtableActions[] }) => {
            const objects = d.records.map(airtable_action => {
                const predicate = find_object_by_airtable_id(airtable_action.id)
                const existing_object = existing_objects.find(predicate)
                return transform_airtable_action({ pattern, airtable_action, existing_object })
            })
            upsert_objects(objects)
        })
    }
}


function find_object_by_airtable_id (airtable_id: string)
{
    return ({ external_ids }: ObjectWithCache) => {

        if (!external_ids) return false

        const id = external_ids[external_id_key]
        if (!id) return false

        return id === airtable_id
    }
}


interface AirtableActions
{
    id: string
    createdTime: string
    fields: {
        Description: string
        Name: string
        Projects: string[]
        ["Encompasing Action"]: string[]  // should only be 0 or 1 value
        ["Action Type"]: "Is Spike" | "Is Conditional" | undefined
        ["Depends on Actions"]: string[]  // 0+ values
        ["Total time (h)"]: number
        Status: "Icebox" | "Todo" | "In progress" | "Done" | undefined
    }
}


interface TransformAirtableActionArgs
{
    pattern: Pattern
    airtable_action: AirtableActions
    existing_object?: ObjectWithCache
}

function transform_airtable_action (args: TransformAirtableActionArgs): ObjectWithCache
{
    const pattern = args.pattern
    if (pattern.id !== CORE_IDS.Action) throw new Error(`transform_airtable_action requires Action pattern`)
    const aa = args.airtable_action
    const eo = args.existing_object

    console.log(eo ? "Found existing" : "Not found existing")

    return {
        id: eo ? eo.id : get_new_id(),
        datetime_created: eo ? eo.datetime_created : new Date(aa.createdTime),
        labels: [],
        pattern_id: pattern.id,
        external_ids: { [external_id_key]: aa.id, ...((eo && eo.external_ids) || {}) },
        pattern_name: pattern.name,
        content: pattern.content,
        attributes: merge_pattern_attributes([
            { pidx: 0, value: aa.fields.Name },
            { pidx: 1, value: "<project id>" },
            { pidx: 2, value: aa.fields.Description },
            { pidx: 3, value: aa.fields.Status || "" },
        ], pattern),
        rendered: "",
        needs_rendering: true,
    }
}
