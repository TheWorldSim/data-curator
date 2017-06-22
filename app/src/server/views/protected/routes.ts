import * as Hapi from "hapi";

import {PATHS} from "../../../shared/paths";
import {HapiAuthCookie} from "../user_session/hapi_auth_cookie";

export const routes = function (server: Hapi.Server) {

    const config: Hapi.RouteAdditionalConfigurationOptions = {
        handler: function (request, reply) {

            const credentials = request.auth.credentials as HapiAuthCookie.CachedCredentials;
            reply(JSON.stringify(credentials) +
                " you are in! And you came from Origin: " + request.headers.origin);
        },
    };

    // Add a protected resource
    server.route({
        path: PATHS.API_V1.PROTECTED,
        method: "GET",
        config,
    });
};
