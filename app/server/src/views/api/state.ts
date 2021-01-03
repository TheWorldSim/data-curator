import { writeFileSync, readFileSync, existsSync } from "fs"
import { Server } from "@hapi/hapi"

import { PATHS } from "../../shared/paths"
import { LOG_TAGS } from "../../shared/constants"


export function state_routes (server: Server)
{
    const file_name_latest = `./state_backup/latest.json`

    function get_latest_state ()
    {
        return existsSync(file_name_latest) ? readFileSync(file_name_latest).toString() : ""
    }


    server.route({
        method: "GET",
        path: PATHS.API_V1.STATE,
        handler: async function (request, h) {

            server.log(LOG_TAGS.INFO, "Got request for state")

            const existing = JSON.stringify(JSON.parse(get_latest_state()))

            const response = h.response(existing)

            response.header("Access-Control-Allow-Origin", "*")
            response.header("Content-Type", "application/json")

            return response
        }
    })


    server.route({
        method: "POST",
        path: PATHS.API_V1.STATE,
        handler: async function (request, h) {

            server.log(LOG_TAGS.INFO, "Got state to save")

            const to_save = JSON.parse(request.payload.toString())
            const to_save_str = JSON.stringify(to_save, null, 2)
            const existing = get_latest_state()

            if (existing !== to_save_str)
            {
                writeFileSync(file_name_latest, to_save_str)
                // writeFileSync(`./state_backup/versions/${new Date().toISOString()}.json`, to_save_str)
            }

            server.log(LOG_TAGS.INFO, "Saving state")
            const response = h.response("{}")

            response.header("Access-Control-Allow-Origin", "*")

            return response
        }
    })
}
