import type { Action, AnyAction } from "redux"

import { ALLOWED_ROUTES, RootState, ROUTE_TYPES, RoutingState } from "./State"


export function parse_url_for_routing_params (url: string): RoutingState
{
    const hash = url.split("#")[1]
    const parts = hash.split("/")
    const route = parts[0] as ROUTE_TYPES
    const element_id = parts[1]

    if (!ALLOWED_ROUTES.includes(route)) return { route: "statements", element_id: undefined }

    return { route, element_id }
}


export function get_current_route_params (): RoutingState
{
    const url = window.location.toString()
    const routing_params = parse_url_for_routing_params(url)
    return routing_params
}


export const routing_reducer = (state: RootState, action: AnyAction): RootState =>
{

    if (is_change_route(action))
    {
        if (state.routing.route !== action.route || state.routing.element_id !== action.element_id)
        {
            state = {
                ...state,
                routing: {
                    route: action.route,
                    element_id: action.element_id,
                }
            }
        }
    }

    // Putting this side effect here seems wrong, perhaps best as a store.subscribe?
    const element_route = state.routing.element_id ? `/${state.routing.element_id}` : ""
    const route = state.routing.route + element_route
    window.location.hash = route

    return state
}


interface ActionChangeRoute extends Action {
    route: ROUTE_TYPES
    element_id: string | undefined
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
