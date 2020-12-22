
export interface Statement
{
    id: string
    content: string
    datetime_created: Date
}


export type ROUTE_TYPES = "filter" | "statements" | "objects" | "patterns" | "creation_context"
export const ALLOWED_ROUTES: ROUTE_TYPES[] = ["filter", "statements", "objects", "patterns", "creation_context"]
export interface RoutingState
{
    route: ROUTE_TYPES
}


export interface RootState
{
    statements: Statement[]
    routing: RoutingState
}
