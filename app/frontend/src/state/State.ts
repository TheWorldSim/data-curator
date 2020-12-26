
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
    statement_type_id: string
    alt_name: string
    multiple?: boolean
}


export interface Objekt extends Statement
{
    attributes: ObjectAttribute[]  // string[]  // statement_ids[]
    pattern_id: string
}
export interface ObjectAttribute
{
    tid: string  // statement_type_id
    id: string   // statement_id
}

export function is_statement (s: Statement | Objekt): s is Statement
{ return !s.hasOwnProperty("pattern_id") }
export function is_objekt (s: Statement | Objekt): s is Objekt
{ return s.hasOwnProperty("pattern_id") }


export type ROUTE_TYPES = "filter" | "statements" | "objects" | "patterns" | "creation_context"
export const ALLOWED_ROUTES: ROUTE_TYPES[] = ["filter", "statements", "objects", "patterns", "creation_context"]
export interface RoutingState
{
    route: ROUTE_TYPES
}


export interface RootState
{
    statements: Statement[]
    patterns: Pattern[]
    objects: Objekt[]
    routing: RoutingState
}
