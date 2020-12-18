import { Server } from "@hapi/hapi"

import { PATHS } from "../../shared/paths"
import { UserDb } from "../../models/user/db"
import { } from "../../shared/models/user"
import { LOG_TAGS } from "../../shared/constants"


export function users_routes (server: Server)
{
    server.route({
        method: "GET",
        path: PATHS.API_V1.USERS_LIST,
        handler: function (request, h) {

            server.log(LOG_TAGS.INFO, "Fetching users")

            return UserDb.findAll()
            .then(res =>
            {
                server.log(LOG_TAGS.INFO, "Fetched users")
                return JSON.stringify(res)
            })
            .catch(err =>
            {
                server.log(LOG_TAGS.EXCEPTION, `Failed to fetched users ${err}`)
                return "Failed to fetched users"
            })
        }
    })
}
