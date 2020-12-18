import { Server } from "@hapi/hapi"

import { PATHS } from "../../shared/paths"


export function routes (server: Server)
{
    server.route({
        method: "GET",
        path: PATHS.HOME,
        handler: function (request, h) {

            return "Hello World!"
        }
    })
}
