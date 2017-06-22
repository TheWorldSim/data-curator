import * as Hapi from "hapi";

import {PATHS} from "../../../shared/paths";
import {ResponsePayload} from "../../../shared/api";
import {get_session_bootstrap} from "./bootstrap_session";

export function routes(server: Hapi.Server) {

    const config: Hapi.RouteAdditionalConfigurationOptions = {
        auth: { mode: "try" },
        handler: function (request, reply) {

            const response: ResponsePayload.BootStrap = {
                session: get_session_bootstrap(request),
            };

            reply("window.bootstrap = " + JSON.stringify(response) + ";")
            .type("application/javascript");
        },
    };

    server.route({
        path: PATHS.API_V1.BOOTSTRAP,
        method: "GET",
        config: config,
    });
}
