import { Component, ComponentClass, h } from "preact"
import { connect, ConnectedProps } from "react-redux"
import { date2str } from "../shared/utils/date_helpers"

import { CoreObject, CoreObjectAttribute, is_id_attribute, ObjectWithCache, Pattern, RootState } from "../state/State"
import { ACTIONS } from "../state/store"
import { get_new_object_id } from "../utils/utils"


interface OwnProps {}


const PATTERN_ID_ACTION_V2 = "p9"
const PATTERN_ID_PRIORITY = "p10"
const PATTERN_ID_EVENT = "p12"
const map_state = (state: RootState) => {
    const pattern_action = state.patterns.find(({ id }) => id === PATTERN_ID_ACTION_V2)
    const pattern_priority = state.patterns.find(({ id }) => id === PATTERN_ID_PRIORITY)
    const pattern_event = state.patterns.find(({ id }) => id === PATTERN_ID_EVENT)

    const ready = state.sync.ready
    if (!pattern_action && ready) throw new Error(`Pattern "Action v2" for id: ${PATTERN_ID_ACTION_V2} not found`)
    if (!pattern_priority && ready) throw new Error(`Pattern "Priority" for id: ${PATTERN_ID_PRIORITY} not found`)
    if (!pattern_event && ready) throw new Error(`Pattern "Event" for id: ${PATTERN_ID_EVENT} not found`)

    return {
        objects: state.objects,
        patterns_available: !!pattern_action && !!pattern_event,
        patterns: {
            action: pattern_action,
            priority: pattern_priority,
            event: pattern_event,
        },
    }
}


const map_dispatch = {
    upsert_objects: ACTIONS.upsert_objects,
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


class _ObjectBulkImport extends Component<Props, {statuses: string[]}>
{
    constructor (props: Props)
    {
        super(props)
        this.state = { statuses: [] }
    }


    render ()
    {
        const add_status = (status: string) => this.setState({ statuses: [...this.state.statuses, status] })
        const set_statuses = (statuses: string[]) => this.setState({ statuses })

        const on_new_objects_factory = (object_type: string) => (objects: CoreObject[]) =>
        {
            add_status(`Successfully fetched ${objects.length} ${object_type} objects`)

            this.props.upsert_objects({ objects })
            setTimeout(() => set_statuses([]), 5000)
        }


        const get_data = () =>
        {
            if (!this.props.patterns_available)
            {
                set_statuses(["Can not fetch objects from AirTable API, patterns not available"])
                setTimeout(() => set_statuses([]), 5000)
                return
            }

            const { patterns, objects } = this.props

            set_statuses(["Fetching objects from AirTable API", ""])
            get_data_from_air_table(patterns.action!, objects, on_new_objects_factory("Action"))
            get_data_from_air_table(patterns.priority!, objects, on_new_objects_factory("Priorities"))
            get_data_from_air_table(patterns.event!, objects, on_new_objects_factory("Event"))
        }


        let { statuses } = this.state
        if (statuses.length) statuses = ["Status:", ...statuses]


        return <div>
            <b>Object Bulk Import</b>

            <br /><br />

            <hr />

            <b>Get AirTable data</b>

            <br /><br />

            <input
                type="button"
                value={this.props.patterns_available ? "Get data" : "(Patterns not available)"}
                onClick={get_data}
                disabled={!!statuses.length || !this.props.patterns_available}
            ></input>

            <br />

            {statuses.map((status, i) => <div key={status + i}><b>{status}</b><br /></div>) }

        </div>
    }
}


export const ObjectBulkImport = connector(_ObjectBulkImport) as ComponentClass<OwnProps>


const EXTERNAL_ID_KEY = "airtable"


function get_data_from_air_table (pattern: Pattern, existing_objects: ObjectWithCache[], on_new_objects: (objects: CoreObject[]) => void)
{
    const auth_key = localStorage.getItem("airtable_auth_key")
    const app = localStorage.getItem("airtable_app")
    // Run: localStorage.setItem("airtable_models", `{"p123": {"table": "Your%20table", "view": "Grid%20view"}}`)
    const models = JSON.parse(localStorage.getItem("airtable_models")!)
    const model = models[pattern.id]

    if (!model) return console.error(`Pattern id "${pattern.id}" could not be found in localStorage.airtable_models`)

    const table = model.table
    const view = model.view

    const maxRecords = 100
    const url = `https://api.airtable.com/v0/${app}/${table}?maxRecords=${maxRecords}&view=${view}`

    const { temporary_ids, get_temp_id } = temp_id_factory()

    fetch(url, { headers: { "Authorization": `Bearer ${auth_key}` } })
    .then(d => d.json())
    .then((d: { records: AirtableAction[] }) =>
    {
        if (d.records.length === maxRecords) alert("Warning, not all objects may have been fetched.")

        const objects_with_temp_ids = d.records.map(airtable_record =>
        {
            const predicate = find_object_by_airtable_id(airtable_record.id)
            const existing_object = existing_objects.find(predicate)

            if (pattern.id === PATTERN_ID_ACTION_V2)
            {
                return transform_airtable_action({ pattern, get_temp_id, airtable_record, existing_object })
            }
            else if (pattern.id === PATTERN_ID_PRIORITY)
            {
                return transform_airtable_priority({ pattern, get_temp_id, airtable_record, existing_object })
            }
            else if (pattern.id === PATTERN_ID_EVENT)
            {
                return transform_airtable_event({ pattern, get_temp_id, airtable_record, existing_object })
            }
            else throw new Error(`Unsupported pattern: ${pattern.id}`)
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


//

type DateString = string
interface TransformAirtableRecordArgs<T>
{
    pattern: Pattern
    get_temp_id: TempIdFunc
    airtable_record: T
    existing_object?: ObjectWithCache
}

//

interface AirtableAction
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

function transform_airtable_action (args: TransformAirtableRecordArgs<AirtableAction>): CoreObject
{
    const { pattern, get_temp_id } = args
    if (pattern.id !== PATTERN_ID_ACTION_V2) throw new Error(`transform_airtable_action requires Action pattern`)
    const ar = args.airtable_record
    const eo = args.existing_object

    const new_object: CoreObject = {
        id: (eo && eo.id) || get_new_object_id(),
        datetime_created: eo ? eo.datetime_created : new Date(ar.createdTime),
        labels: [],
        pattern_id: pattern.id,
        external_ids: { [EXTERNAL_ID_KEY]: ar.id, ...((eo && eo.external_ids) || {}) },
        attributes: [
            { pidx: 0, value: ar.fields.name || "" },
            ...airtable_multi_field_to_multi_attributes({ pidx: 1, field: ar.fields.projects, get_temp_id }),
            { pidx: 2, value: ar.fields.description || "" },
            { pidx: 3, value: ar.fields.status || "" },
            airtable_multi_field_to_single_attribute({ pidx: 4, field: ar.fields.encompassing_action, get_temp_id }),
            ...airtable_multi_field_to_multi_attributes({ pidx: 5, field: ar.fields.depends_on_actions, get_temp_id }),
            { pidx: 6, value: ar.fields.why || "" },
            { pidx: 7, value: num_to_string(ar.fields.time_h) },
            { pidx: 8, value: date_to_string(ar.fields.start_datetime) },
            { pidx: 9, value: date_to_string(ar.fields.stop_datetime) },
            { pidx: 10, value: ar.fields["Action Type"] || "" },
            { pidx: 11, value: date_to_string(ar.fields.deadline_review_datetime) },
            { pidx: 12, value: ar.fields.is_project ? "(Project)" : "" },
        ],
    }

    return new_object
}


//

interface AirtablePriority
{
    id: string
    createdTime: string
    fields: Partial<{
        project: string[]  // 0 or 1 value
        start_datetime: DateString
        effort: number
        why: string
    }>
}

function transform_airtable_priority (args: TransformAirtableRecordArgs<AirtablePriority>): CoreObject
{
    const { pattern, get_temp_id } = args
    if (pattern.id !== PATTERN_ID_PRIORITY) throw new Error(`transform_airtable_priority requires Priority pattern`)
    const ar = args.airtable_record
    const eo = args.existing_object

    const new_object: CoreObject = {
        id: (eo && eo.id) || get_new_object_id(),
        datetime_created: eo ? eo.datetime_created : new Date(ar.createdTime),
        labels: [],
        pattern_id: pattern.id,
        external_ids: { [EXTERNAL_ID_KEY]: ar.id, ...((eo && eo.external_ids) || {}) },
        attributes: [
            airtable_multi_field_to_single_attribute({ pidx: 0, field: ar.fields.project, get_temp_id }),
            { pidx: 1, value: date_to_string(ar.fields.start_datetime) },
            { pidx: 2, value: num_to_string(ar.fields.effort) },
            { pidx: 3, value: ar.fields.why || "" },
        ],
    }

    return new_object
}

//
interface AirtableEvent
{
    id: string
    createdTime: string
    fields: Partial<{
        title: string
        date: DateString
        description: string
        related_actions: string[]
    }>
}

function transform_airtable_event (args: TransformAirtableRecordArgs<AirtableEvent>): CoreObject
{
    const { pattern, get_temp_id } = args
    if (pattern.id !== PATTERN_ID_EVENT) throw new Error(`transform_airtable_event requires Event pattern`)
    const ar = args.airtable_record
    const eo = args.existing_object

    const new_object: CoreObject = {
        id: (eo && eo.id) || get_new_object_id(),
        datetime_created: eo ? eo.datetime_created : new Date(ar.createdTime),
        labels: [],
        pattern_id: pattern.id,
        external_ids: { [EXTERNAL_ID_KEY]: ar.id, ...((eo && eo.external_ids) || {}) },
        attributes: [
            { pidx: 0, value: ar.fields.title || "" },
            { pidx: 1, value: date_to_string(ar.fields.date) },
            { pidx: 2, value: ar.fields.description || "" },
            ...airtable_multi_field_to_multi_attributes({ pidx: 3, field: ar.fields.related_actions, get_temp_id }),
        ],
    }

    return new_object
}


//

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



const MSECONDS_PER_DAY = 86400000
const date_to_string = (v: DateString | undefined): string => {
    if (!v) return ""

    const d = new Date(v)
    if (isNaN(d as any)) return ""

    if (d.getTime() % 86400000 === 0) return date2str(d, "yyyy-MM-dd")

    return date2str(d, "yyyy-MM-dd HH:mm")
}
const num_to_string = (v: number | undefined): string => v === undefined ? "" : `${v}`
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
