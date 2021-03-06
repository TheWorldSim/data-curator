
export interface Statement
{
    id: string
    datetime_created: Date
    content: string
    // datetime_custom_created?: Date
    // datetime_modified?: Date
    labels: string[]  // statement_ids[]
}


export interface Pattern
{
    id: string
    datetime_created: Date
    name: string
    content: string
    attributes: PatternAttribute[]
}

export interface PatternAttribute
{
    type_id: string
    alt_name: string
    multiple?: boolean
}


export interface CoreObject
{
    id: string
    datetime_created: Date
    labels: string[]  // statement_ids[]
    attributes: CoreObjectAttribute[]
    pattern_id: string
    external_ids: { [application: string]: string }
}
export interface Objekt extends CoreObject
{
    pattern_name: string  // denormalised from Pattern
    content: string       // denormalised from Pattern
    attributes: ObjectAttribute[]
}
export interface ObjectWithCache extends Objekt
{
    rendered: string
    is_rendered: boolean
}

export interface CoreObjectIdAttribute {
    pidx: number
    id: string /* statement_id */
}
export interface CoreObjectValueAttribute {
    pidx: number
    value: string
}
export type CoreObjectAttribute = CoreObjectIdAttribute | CoreObjectValueAttribute
export type ObjectAttribute = CoreObjectAttribute & {
    pattern: PatternAttribute
}

export const is_id_attribute = (a: CoreObjectAttribute): a is CoreObjectIdAttribute => a.hasOwnProperty("id")
export const is_value_attribute = (a: CoreObjectAttribute): a is CoreObjectValueAttribute => a.hasOwnProperty("value")


export type Item = Statement | Pattern | ObjectWithCache


export type SYNC_STATUS = "LOADING" | "SAVING" | undefined
export interface SyncState
{
    ready: boolean
    status: SYNC_STATUS
}


export type ROUTE_TYPES = (
    "filter"
    | "statements"
    | "objects"
    | "patterns"
    | "creation_context"
    | "views"
)
export type SUB_ROUTE_TYPES = "objects_bulk_import" | null
export const ALLOWED_ROUTES: ROUTE_TYPES[] = [
    "filter",
    "statements",
    "objects",
    "patterns",
    "creation_context",
    "views",
]
export const ALLOWED_SUB_ROUTES: {[k in ROUTE_TYPES]: SUB_ROUTE_TYPES[]} = {
    "filter": [],
    "statements": [],
    "objects": ["objects_bulk_import"],
    "patterns": [],
    "creation_context": [],
    "views": [],
}
export interface RoutingState
{
    route: ROUTE_TYPES
    sub_route: SUB_ROUTE_TYPES
    item_id: string | null
    args: RoutingArgs
}
export type RoutingArgs = {
    date: string
    time: string
    view: string
    zoom: string
    x: string
    y: string
}
export type RoutingArgKey = keyof RoutingArgs
const ALLOWED_ROUTE_ARG_KEYS: RoutingArgKey[] = [
    "date",
    "time",
    "view",
    "zoom",
    "x",
    "y",
]
export function is_route_arg_key (key: string): key is RoutingArgKey
{
    return ALLOWED_ROUTE_ARG_KEYS.includes(key as RoutingArgKey)
}


export interface GlobalKeyPress
{
    last_key: string | undefined
    last_key_time_stamp: number | undefined
}


export interface CurrentDateTime
{
    dt: Date
}


export interface RootStateCore
{
    statements: Statement[]
    patterns: Pattern[]
    objects: ObjectWithCache[]
}
export interface RootState extends RootStateCore
{
    sync: SyncState
    routing: RoutingState
    global_key_press: GlobalKeyPress
    current_datetime: CurrentDateTime
}
