import { writeFileSync, readFileSync, existsSync } from "fs"
import { Server } from "@hapi/hapi"

import { PATHS } from "../../shared/paths"
import { LOG_TAGS } from "../../shared/constants"


export function state_routes (server: Server)
{
    server.route({
        method: "POST",
        path: PATHS.API_V1.SAVE_STATE,
        handler: async function (request, h) {

            server.log(LOG_TAGS.INFO, "Got state to save")

            const file_name_latest = `./state_backup/latest.json`
            const to_save = request.payload.toString()
            const existing = existsSync(file_name_latest) ? readFileSync(file_name_latest).toString() : ""

            if (existing !== to_save)
            {
                writeFileSync(file_name_latest, to_save)
                writeFileSync(`./state_backup/${new Date().toISOString()}.json`, to_save)
            }

            server.log(LOG_TAGS.INFO, "Saving state")
            const response = h.response("{}")

            response.header("Access-Control-Allow-Origin", "*")

            return response
        }
    })
}
