import type { Action, AnyAction } from "redux"
import { id_is_object, id_is_pattern, id_is_statement, id_is_valid } from "../utils/utils"

import { ALLOWED_ROUTES, ALLOWED_SUB_ROUTES, RootState, ROUTE_TYPES, RoutingState, SUB_ROUTE_TYPES } from "./State"


function parse_url_for_routing_params ({ url, state }: { url: string, state: RootState }): RoutingState
{
    const hash = url.split("#")[1] || ""
    const parts = hash.split("/")
    const route = parts[0] as ROUTE_TYPES

    if (!ALLOWED_ROUTES.includes(route)) return { route: "statements", sub_route: undefined, item_id: undefined }

    const part2 = parts[1] as SUB_ROUTE_TYPES | undefined
    let sub_route: SUB_ROUTE_TYPES | undefined = undefined
    let item_id: string | undefined = undefined

    if (ALLOWED_SUB_ROUTES[route].includes(part2 as any)) sub_route = part2
    else item_id = part2 as string


    if (!id_is_valid(item_id)) item_id = undefined

    const ready = state.sync.ready
    if (ready && id_is_statement(item_id) && !state.statements.find(({ id }) => id === item_id)) item_id = undefined
    if (ready && id_is_pattern(item_id) && !state.patterns.find(({ id }) => id === item_id)) item_id = undefined
    if (ready && id_is_object(item_id) && !state.objects.find(({ id }) => id === item_id)) item_id = undefined


    return { route, sub_route, item_id }
}


export function get_current_route_params (state: RootState): RoutingState
{
    const url = window.location.toString()
    const routing_params = parse_url_for_routing_params({ url, state })
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
