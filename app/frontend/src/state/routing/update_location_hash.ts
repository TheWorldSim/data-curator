import type { Store } from "redux"

import type { RootState, RoutingState } from "../State"
import { routing_state_to_string } from "./routing"


export const factory_update_location_hash = (store: Store<RootState>) =>
{
    let routing_state: RoutingState

    function update_location_hash ()
    {
        const state = store.getState()
        if (routing_state === state.routing) return
        routing_state = state.routing

        const route = routing_state_to_string(routing_state)
        window.location.hash = route
    }

    update_location_hash() // initial invokation to update hash

    return update_location_hash
}
