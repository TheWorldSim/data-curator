import { FunctionComponent, h } from "preact"
import { useState } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"

import { CoreObject, CoreObjectAttribute, is_id_attribute, ObjectWithCache, Pattern, RootState } from "../state/State"
import { ACTIONS } from "../state/store"
import { get_new_object_id } from "../utils/utils"


interface OwnProps {}


const PATTERN_ACTION_V2 = "p6396372272707644"
const map_state = (state: RootState) => {
    const action = state.patterns.find(({ id }) => id === PATTERN_ACTION_V2)
    const ready = state.sync.ready
    if (!action && ready) throw new Error(`Pattern "Action" for id: ${PATTERN_ACTION_V2} not found`)

    return {
        objects: state.objects,
        patterns: { action },
    }
}


const map_dispatch = {
    upsert_objects: ACTIONS.upsert_objects,
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


function _ObjectBulkImport (props: Props)
{
    const [status, set_status] = useState("")

    const on_new_objects = (objects: CoreObject[]) =>
    {
        set_status(`Successfully fetched ${objects.length} objects`)

        props.upsert_objects({ objects })
        setTimeout(() => {
            set_status("")
        }, 2000)
    }

    const get_data = () =>
    {
        set_status("Fetching objects from AirTable API")
        get_data_from_air_table(props.patterns.action, props.objects, on_new_objects)
    }

    return <div>
        <b>Object Bulk Import</b>

        <br /><br />

        <hr />

        <b>Get AirTable data</b>

        <br /><br />

        <input
            type="button"
            value="Get data"
            onClick={get_data}
            disabled={!!status}
        ></input>

        <br />

        {status && <b>Status: {status}</b>}

    </div>
}


export const ObjectBulkImport = connector(_ObjectBulkImport) as FunctionComponent<OwnProps>


const EXTERNAL_ID_KEY = "airtable"


function get_data_from_air_table (pattern: Pattern, existing_objects: ObjectWithCache[], on_new_objects: (objects: CoreObject[]) => void)
{
    const auth_key = localStorage.getItem("airtable_auth_key")
    const app = localStorage.getItem("airtable_app")
    const table = localStorage.getItem("airtable_table")
    const view = localStorage.getItem("airtable_view")
    const url = `https://api.airtable.com/v0/${app}/${table}?maxRecords=100&view=${view}`

    const { temporary_ids, get_temp_id } = temp_id_factory()

    fetch(url, { headers: { "Authorization": `Bearer ${auth_key}` } })
    .then(d => d.json())
    .then((d: { records: AirtableActions[] }) =>
    {

        const objects_with_temp_ids = d.records.map(airtable_action =>
        {
            const predicate = find_object_by_airtable_id(airtable_action.id)
            const existing_object = existing_objects.find(predicate)
            return transform_airtable_action({ pattern, get_temp_id, airtable_action, existing_object })
        })

        const objects: CoreObject[] = replace_temp_ids({ objects_with_temp_ids, existing_objects, temporary_ids })

        on_new_objects(objects)
    })
}


function find_object_by_airtable_id (airtable_id: string)
{
    return ({ external_ids }: ObjectWithCache) => {

        if (!external_ids) return false

        const id = external_ids[EXTERNAL_ID_KEY]
        if (!id) return false

        return id === airtable_id
    }
}


type DateString = string
interface AirtableActions
{
    id: string
    createdTime: string
    fields: Partial<{
        name: string
        projects: string[]
        description: string
        status: "Icebox" | "Todo" | "In progress" | "Done"
        encompassing_action: string[]  // should only be 0 or 1 value
        depends_on_actions: string[]  // 0+ values
        why: string
        time_h: number
        start_datetime: DateString
        stop_datetime: DateString
        "Action Type": "Is Spike" | "Is Conditional"
        deadline_review_datetime: DateString
        is_project: true
    }>
}


interface TransformAirtableActionArgs
{
    pattern: Pattern
    get_temp_id: TempIdFunc
    airtable_action: AirtableActions
    existing_object?: ObjectWithCache
}

function transform_airtable_action (args: TransformAirtableActionArgs): CoreObject
{
    const { pattern, get_temp_id } = args
    if (pattern.id !== PATTERN_ACTION_V2) throw new Error(`transform_airtable_action requires Action pattern`)
    const aa = args.airtable_action
    const eo = args.existing_object

    const new_action_object: CoreObject = {
        id: (eo && eo.id) || get_new_object_id(),
        datetime_created: eo ? eo.datetime_created : new Date(aa.createdTime),
        labels: [],
        pattern_id: pattern.id,
        external_ids: { [EXTERNAL_ID_KEY]: aa.id, ...((eo && eo.external_ids) || {}) },
        attributes: [
            { pidx: 0, value: aa.fields.name || "" },
            ...airtable_multi_field_to_multi_attributes({ pidx: 1, field: aa.fields.projects, get_temp_id }),
            { pidx: 2, value: aa.fields.description || "" },
            { pidx: 3, value: aa.fields.status || "" },
            airtable_multi_field_to_single_attribute({ pidx: 4, field: aa.fields.encompassing_action, get_temp_id }),
            ...airtable_multi_field_to_multi_attributes({ pidx: 5, field: aa.fields.depends_on_actions, get_temp_id }),
            { pidx: 6, value: aa.fields.why || "" },
            { pidx: 7, value: num_to_string(aa.fields.time_h) },
            { pidx: 8, value: date_to_string(aa.fields.start_datetime) },
            { pidx: 9, value: date_to_string(aa.fields.stop_datetime) },
            { pidx: 10, value: aa.fields["Action Type"] || "" },
            { pidx: 11, value: date_to_string(aa.fields.deadline_review_datetime) },
            { pidx: 12, value: bool_to_string(aa.fields.is_project) },
        ],
    }

    return new_action_object
}


interface AirtableMultiFieldToSingleAttributeArgs
{
    pidx: number
    field: string[] | undefined
    get_temp_id: TempIdFunc
}
function airtable_multi_field_to_single_attribute (args: AirtableMultiFieldToSingleAttributeArgs)
{
    const { pidx, get_temp_id, field } = args
    const field_normalised: string[] = field || []
    return { pidx, id: get_temp_id(field_normalised[0]) }
}


interface AirtableMultiFieldToMultiAttributesArgs
{
    pidx: number
    field: string[] | undefined
    get_temp_id: TempIdFunc
}
function airtable_multi_field_to_multi_attributes (args: AirtableMultiFieldToMultiAttributesArgs)
{
    const { pidx, get_temp_id, field } = args
    const field_normalised: string[] = field || []
    const attributes = field_normalised.map(v => ({ pidx, id: get_temp_id(v) }))

    return attributes.length ? attributes : [{ pidx, id: "" }]
}


const num_to_string = (v: number | undefined): string => v === undefined ? "" : `${v}`
const date_to_string = (v: DateString | undefined): string => v === undefined ? "" : v
const bool_to_string = (v: Boolean | undefined): string => v ? "Yes" : "No"


interface TempIdFunc {
    (id: string | undefined): string
}
const TEMP_ID_PREFIX = "temp_id: "
function temp_id_factory () {
    const temporary_ids: { [id: string]: number } = {}

    const get_temp_id: TempIdFunc = id => {
        if (!id) return ""

        if (!temporary_ids.hasOwnProperty(id)) temporary_ids[id] = 0
        temporary_ids[id] += 1

        return `${TEMP_ID_PREFIX}${id}`
    }

    return {
        temporary_ids,
        get_temp_id,
    }
}


interface ReplaceTempIdsArgs
{
    objects_with_temp_ids: CoreObject[]
    existing_objects: CoreObject[]
    temporary_ids: { [id: string]: number }
}
function replace_temp_ids (args: ReplaceTempIdsArgs): CoreObject[]
{
    const { objects_with_temp_ids, existing_objects, temporary_ids } = args

    const airtable_id_map = build_airtable_id_map({
        objects_with_temp_ids,
        existing_objects,
        expected_ids: Object.keys(temporary_ids)
    })

    const objects = change_temp_ids({ objects_with_temp_ids, airtable_id_map })

    return objects
}


interface BuildAirtableIdMapArgs
{
    objects_with_temp_ids: CoreObject[]
    existing_objects: CoreObject[]
    expected_ids: string[]
}
type ID_MAP = { [ airtable_id: string]: string }
function build_airtable_id_map (args: BuildAirtableIdMapArgs): ID_MAP
{
    const { objects_with_temp_ids, existing_objects, expected_ids } = args

    const id_map: ID_MAP = {}

    mutate_id_map_with_objects(objects_with_temp_ids, id_map)
    mutate_id_map_with_objects(existing_objects, id_map)

    // Check all temporary_ids are present in map
    const missing_ids: Set<string> = new Set()
    expected_ids.forEach(id => {
        if (!id_map.hasOwnProperty(id)) missing_ids.add(id)
    })

    if (missing_ids.size) throw new Error(`Missing ${missing_ids.size} ids from objects`)

    return id_map
}


function mutate_id_map_with_objects (objects: CoreObject[], id_map: ID_MAP)
{
    objects.forEach(o => {
        const airtable_id = o.external_ids[EXTERNAL_ID_KEY]

        if (!airtable_id) return

        if (!o.id)
        {
            throw new Error(`No id for object`)
        }

        if (id_map.hasOwnProperty(airtable_id) && id_map[airtable_id] !== o.id)
        {
            throw new Error(`Mismatch in id map: ${airtable_id} -> ${o.id} but already have ${airtable_id} -> ${id_map[airtable_id]}`)
        }

        id_map[airtable_id] = o.id
    })
}


interface ChangeTempIdsArgs
{
    objects_with_temp_ids: CoreObject[]
    airtable_id_map: ID_MAP
}
function change_temp_ids (args: ChangeTempIdsArgs)
{
    const { objects_with_temp_ids, airtable_id_map } = args

    return objects_with_temp_ids.map(o => replace_attributes_temp_ids(o, airtable_id_map))
}


function replace_attributes_temp_ids (object: CoreObject, airtable_id_map: ID_MAP): CoreObject
{
    let changed = false

    const new_attributes = object.attributes.map(a =>
    {
        const new_a = replace_attribute_temp_id(a, airtable_id_map)
        const attribute_changed = new_a !== a
        changed = changed || attribute_changed
        return attribute_changed ? new_a : a
    })

    return changed ? { ...object, attributes: new_attributes } : object
}


function replace_attribute_temp_id (attribute: CoreObjectAttribute, airtable_id_map: ID_MAP): CoreObjectAttribute
{
    let new_id: string | undefined = undefined

    if (is_id_attribute(attribute))
    {
        if (attribute.id.startsWith(TEMP_ID_PREFIX))
        {
            const temp_id = attribute.id.slice(TEMP_ID_PREFIX.length)
            if (!airtable_id_map.hasOwnProperty(temp_id)) throw new Error(`Uknown temp_id: ${temp_id}`)
            new_id = airtable_id_map[temp_id]
        }
    }

    return new_id === undefined ? attribute : { ...attribute, id: new_id }
}
