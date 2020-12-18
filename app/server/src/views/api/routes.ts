import { Server } from "@hapi/hapi"

import { users_routes } from "./users"


export function routes (server: Server)
{
    users_routes(server)
}
