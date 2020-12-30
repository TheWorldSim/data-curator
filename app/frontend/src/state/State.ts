
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


export interface Objekt extends Statement
{
    attributes: ObjectAttribute[]
    pattern_id: string
    pattern_name: string  // denormalised from Pattern along with `content`
}
export type ObjectAttribute =
{
    tid: string  // statement_type_id  // denormalised from Pattern attribute(s)
    id?: string   // statement_id
    value?: string
}


export type Item = Statement | Pattern | Objekt


export type ROUTE_TYPES = "filter" | "statements" | "objects" | "patterns" | "creation_context"
export const ALLOWED_ROUTES: ROUTE_TYPES[] = ["filter", "statements", "objects", "patterns", "creation_context"]
export interface RoutingState
{
    route: ROUTE_TYPES
    item_id: string | undefined
}


export interface GlobalKeyPress
{
    last_key: string | undefined
    last_key_time_stamp: number | undefined
}


export interface RootState
{
    statements: Statement[]
    patterns: Pattern[]
    objects: Objekt[]
    routing: RoutingState
    global_key_press: GlobalKeyPress
}
