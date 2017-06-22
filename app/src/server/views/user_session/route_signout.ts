import * as Boom from "boom";
import * as Hapi from "hapi";

import {PATHS} from "../../../shared/paths";
import {ERRORS} from "../../../shared/errors";
import {ResponsePayload} from "../../../shared/api";

// Signout

export function add_signout_route(server: Hapi.Server) {

    const config: Hapi.RouteAdditionalConfigurationOptions = {
        auth: { mode: "try" },
        handler: function (request, reply) {

            if (!request.auth.isAuthenticated) {

                reply(Boom.badRequest(ERRORS.ALREADY_SIGNED_OUT));
                return;
            }

            request.cookieAuth.clear();
            const response: ResponsePayload.SignOutSuccess = { status: "SIGNED_OUT" };
            reply(response);
        },
    };

    server.route({
        path: PATHS.API_V1.SIGNOUT,
        method: "POST",
        config: config,
    });
}
