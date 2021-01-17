import type { Action, AnyAction } from "redux"
import { id_is_object, id_is_pattern, id_is_statement, id_is_valid } from "../../utils/utils"

import { ALLOWED_ROUTES, ALLOWED_SUB_ROUTES, is_route_arg_key, RootState, ROUTE_TYPES, RoutingArgKey, RoutingArgs, RoutingState, SUB_ROUTE_TYPES } from "../State"


function parse_url_for_routing_params ({ url, state }: { url: string, state: RootState }): RoutingState
{
    const hash = url.split("#")[1] || ""
    const main_parts = hash.split("&")
    const parts = main_parts[0].split("/")
    const route = parts[0] as ROUTE_TYPES

    if (!ALLOWED_ROUTES.includes(route))
    {
        return { route: "statements", sub_route: null, item_id: null, args: state.routing.args }
    }

    const part2 = (parts[1] || null) as SUB_ROUTE_TYPES
    let sub_route: SUB_ROUTE_TYPES = null
    let item_id: string | null = null

    if (ALLOWED_SUB_ROUTES[route].includes(part2 as any)) sub_route = part2
    else item_id = part2 as string


    if (!id_is_valid(item_id)) item_id = null

    const ready = state.sync.ready
    if (ready && id_is_statement(item_id) && !state.statements.find(({ id }) => id === item_id)) item_id = null
    if (ready && id_is_pattern(item_id) && !state.patterns.find(({ id }) => id === item_id)) item_id = null
    if (ready && id_is_object(item_id) && !state.objects.find(({ id }) => id === item_id)) item_id = null

    const args: RoutingArgs = {
        ...state.routing.args,
    }

    if (main_parts.length > 1)
    {
        main_parts.slice(1)
        .forEach(part => {
            const [key, value] = part.split("=")
            if (!value) return
            if (!is_route_arg_key(key)) return
            args[key] = value
        })
    }

    return { route, sub_route, item_id, args }
}


export function routing_state_to_string (args: RoutingState): string
{
    const sub_route = args.sub_route ? `${args.sub_route}/` : ""
    const element_route = args.item_id ? `${args.item_id}/` : ""

    const routing_args = args.args || {}
    const routing_args_str = routing_args_to_string(routing_args)
    return "#" + args.route + "/" + sub_route + element_route + routing_args_str
}

function routing_args_to_string (routing_args: RoutingArgs)
{
    const routing_args_str = Object.keys(routing_args)
        .sort()
        .map(key => `&${key}=${routing_args[key as RoutingArgKey]}`)
        .join("")

    return routing_args_str
}


export function get_current_route_params (state: RootState): RoutingState
{
    const url = window.location.toString()
    const routing_params = parse_url_for_routing_params({ url, state })
    return routing_params
}


//

export function merge_routing_state (current_routing_state: RoutingState, new_routing_state: ActionChangeRouteArgs): RoutingState
{
    const {
        route,
        sub_route,
        item_id,
        args,
    } = current_routing_state

    const merged_args = { ...args, ...new_routing_state.args }
    Object.keys(merged_args).forEach(key => {
        const no_value = !merged_args[key as RoutingArgKey]
        const not_valid = !is_route_arg_key(key)
        if (no_value || not_valid) delete merged_args[key as RoutingArgKey]
    })

    return {
        route: new_routing_state.route || route,
        sub_route: new_routing_state.sub_route === null ? null : (new_routing_state.sub_route || sub_route),
        item_id: new_routing_state.item_id === null ? null : (new_routing_state.item_id || item_id),
        args: merged_args,
    }
}


export const routing_reducer = (state: RootState, action: AnyAction): RootState =>
{

    if (is_change_route(action))
    {
        const {
            route,
            sub_route,
            item_id,
            args,
        } = state.routing

        const merged = merge_routing_state(state.routing, action)

        const changed = (
            route !== merged.route
            || sub_route !== merged.sub_route
            || item_id !== merged.item_id
            || routing_args_to_string(args) !== routing_args_to_string(merged.args)
        )

        if (changed)
        {
            state = { ...state, routing: merged }
        }
    }

    return state
}



interface ActionChangeRouteArgs {
    route?: ROUTE_TYPES
    sub_route?: SUB_ROUTE_TYPES | null
    item_id?: string | null
    args?: Partial<RoutingArgs>
}
interface ActionChangeRoute extends Action, ActionChangeRouteArgs {}

const change_route_type = "change_route"

export const change_route = (routing_params: ActionChangeRouteArgs): ActionChangeRoute =>
{
    return { type: change_route_type, ...routing_params }
}

const is_change_route = (action: AnyAction): action is ActionChangeRoute =>
{
    return action.type === change_route_type
}


export const routing_actions = {
    change_route,
}
