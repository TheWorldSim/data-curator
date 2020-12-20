
export interface Statement
{
    id: string
    content: string
    datetime_created: Date
}


export interface DesiredState
{
    id: string
    content: string
    datetime_created: Date
}


export type ROUTE_TYPES = "statements" | "desired_states"
export const ALLOWED_ROUTES: ROUTE_TYPES[] = ["statements", "desired_states"]
export interface RoutingState
{
    route: ROUTE_TYPES
}


export interface RootState
{
    statements: Statement[]
    desired_states: DesiredState[]
    routing: RoutingState
}
