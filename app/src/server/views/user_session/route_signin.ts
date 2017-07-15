import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";

import CONFIG from "../../../shared/config";
import {PATHS} from "../../../shared/paths";
import {ERRORS} from "../../../shared/errors";
import {LOG_TAGS} from "../../../shared/constants";
import {RequestPayload} from "../../../shared/api";
import {ServerAppData} from "../bootstrap/server_app";
import {HapiAuthCookie, hash_uuid} from "./hapi_auth_cookie";
import {verify_password__for_web_api} from "./get_and_verify_user";

// Signin

export function add_signin_route(server: Hapi.Server) {

    const config: Hapi.RouteAdditionalConfigurationOptions = {
        auth: { mode: "try" },
        validate: { payload: RequestPayload.Validate_UserSignIn },
        handler: function (request, reply) {

            if (request.auth.isAuthenticated) {
                reply(Boom.badRequest(ERRORS.ALREADY_SIGNED_IN));
                return;
            }

            const {username_or_email, password} = request.payload as RequestPayload.UserSignIn;

            // TODO SECURITY add rate limiting, ip throttling to prevent (D)DOS
            // TODO SECURITY add rate limiting, ip throttling to prevent guessing weaker passwords
            verify_password__for_web_api({email: username_or_email, password}, server)
            .then((response) => {

                const user = response.data.user;
                const to_cache: HapiAuthCookie.CachedCredentials = { user };
                const sid = hash_uuid(user.uuid);
                (server.app as ServerAppData).sessions_cache.set(sid, to_cache,
                    CONFIG.SESSION_EXPIRY_IN_MILLISECONDS, (err) => {

                    if (err) {
                        reply(err);
                        return;
                    }

                    request.cookieAuth.set({ sid });
                    reply(response);
                });
            })
            .catch((error) => {

                if (error.isBoom) {

                    reply(error);
                }
                else {

                    // Really bad implementation.  Should never get here.
                    server.log(LOG_TAGS.EXCEPTION, "EXCEPTION: unhandled error whilst user logging in: ", error);
                    reply(Boom.badImplementation("Error user logging in"));
                }
            });
        },
    };

    server.route({
        path: PATHS.API_V1.SIGNIN,
        method: "POST",
        config: config,
    });
}
