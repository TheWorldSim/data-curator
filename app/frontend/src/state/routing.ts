import type { Action, AnyAction } from "redux"

import { ALLOWED_ROUTES, RootState, ROUTE_TYPES, RoutingState } from "./State"


export function parse_url_for_routing_params (url: string): RoutingState
{
    const hash = url.split("#")[1]
    const parts = hash.split("/")
    const route = parts[0] as ROUTE_TYPES
    const item_id = parts[1]

    if (!ALLOWED_ROUTES.includes(route)) return { route: "statements", item_id: undefined }

    return { route, item_id }
}


export function get_current_route_params (): RoutingState
{
    const url = window.location.toString()
    const routing_params = parse_url_for_routing_params(url)
    return routing_params
}


export function get_route (args: { route: ROUTE_TYPES, item_id?: string }): string
{
    const element_route = args.item_id ? `/${args.item_id}` : ""
    return "#" + args.route + element_route
}


export const routing_reducer = (state: RootState, action: AnyAction): RootState =>
{

    if (is_change_route(action))
    {
        if (state.routing.route !== action.route || state.routing.item_id !== action.item_id)
        {
            state = {
                ...state,
                routing: {
                    route: action.route,
                    item_id: action.item_id,
                }
            }
        }
    }

    // Putting this side effect here seems wrong, perhaps best as a store.subscribe?
    const route = get_route(state.routing)
    window.location.hash = route

    return state
}


interface ActionChangeRoute extends Action {
    route: ROUTE_TYPES
    item_id: string | undefined
}

const change_route_type = "change_route"

export const change_route = (routing_params: RoutingState): ActionChangeRoute =>
{
    return { type: change_route_type, ...routing_params }
}

const is_change_route = (action: AnyAction): action is ActionChangeRoute => {
    return action.type === change_route_type
}


export const routing_actions = {
    change_route,
}
