import { global_key_press_actions } from "./global_key_press"
import { object_actions } from "./objects/objects"
import { pattern_actions } from "./pattern_actions"
import { routing_actions } from "./routing/routing"
import { statement_actions } from "./statements"
import { sync_actions } from "./sync"


export const ACTIONS =
{
    ...pattern_actions,
    ...statement_actions,
    ...object_actions,
    ...sync_actions,
    ...routing_actions,
    ...global_key_press_actions,
}
