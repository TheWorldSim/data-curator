import type { Action, AnyAction } from "redux"

import { ALLOWED_ROUTES, RootState, ROUTE_TYPES } from "./State"


export function get_current_route (): ROUTE_TYPES
{
    let route: ROUTE_TYPES = window.location.hash.slice(1) as any

    if (!ALLOWED_ROUTES.includes(route)) route = "statements"

    return route
}


export const routing_reducer = (state: RootState, action: AnyAction) =>
{

    if (is_change_route(action))
    {
        if (state.routing.route !== action.route)
        {
            state = {
                ...state,
                routing: {
                    route: action.route
                }
            }
        }
    }

    // Putting this side effect here seems wrong, perhaps best as a store.subscribe?
    window.location.hash = state.routing.route

    return state
}


interface ActionChangeRoute extends Action {
    route: ROUTE_TYPES
}

const change_route_type = "change_route"

export const change_route = (route: ROUTE_TYPES): ActionChangeRoute =>
{
    return { type: change_route_type, route }
}

const is_change_route = (action: AnyAction): action is ActionChangeRoute => {
    return action.type === change_route_type
}


export const routing_actions = {
    change_route,
}
