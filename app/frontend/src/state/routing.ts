import type { Action, AnyAction } from "redux"

import { ALLOWED_ROUTES, RootState, ROUTE_TYPES, RoutingState, SUB_ROUTE_TYPES } from "./State"


export function parse_url_for_routing_params (url: string): RoutingState
{
    const hash = url.split("#")[1] || ""
    const parts = hash.split("/")
    const route = parts[0] as ROUTE_TYPES
    const sub_route = parts[1] as SUB_ROUTE_TYPES | undefined
    const item_id = parts[2]

    if (!ALLOWED_ROUTES.includes(route)) return { route: "statements", sub_route: undefined, item_id: undefined }

    return { route, sub_route, item_id }
}


export function get_current_route_params (): RoutingState
{
    const url = window.location.toString()
    const routing_params = parse_url_for_routing_params(url)
    return routing_params
}


export function get_route (args: { route: ROUTE_TYPES, sub_route?: SUB_ROUTE_TYPES, item_id?: string }): string
{
    const sub_route = args.sub_route ? `${args.sub_route}/` : ""
    const element_route = args.item_id ? `${args.item_id}/` : ""
    return "#" + args.route + "/" + sub_route + element_route
}


export const routing_reducer = (state: RootState, action: AnyAction): RootState =>
{

    if (is_change_route(action))
    {
        const {
            route,
            sub_route,
            item_id,
        } = state.routing

        if (route !== action.route || sub_route !== action.sub_route || item_id !== action.item_id)
        {
            state = {
                ...state,
                routing: {
                    route: action.route,
                    sub_route: action.sub_route,
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
    sub_route: SUB_ROUTE_TYPES | undefined
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
