import * as Hapi from "hapi";
import * as Joi from "joi";
import * as Boom from "boom";

import CONFIG from "../../../shared/config";
import {PATHS} from "../../../shared/paths";
import {ERRORS} from "../../../shared/errors";
import {LOG_TAGS} from "../../../shared/constants";
import {RequestPayload} from "../../../shared/api";
import {create_user} from "./create_user";

export const routes = function (server: Hapi.Server) {

    var config: Hapi.RouteAdditionalConfigurationOptions = {
        auth: { mode: "try" },
        validate: {
            payload: {
                email: Joi.string().required().email().max(CONFIG.MAX_EMAIL_LENGTH),
                // TODO search for joi validation for poor passwords, like "passwordpassword" or "12345678"
                password: Joi.string().required()
                    .min(CONFIG.MIN_PASSWORD_LENGTH)
                    .max(CONFIG.MAX_PASSWORD_LENGTH),
            },
        },
        handler: function (request, reply) {

            if (request.auth.isAuthenticated) {
                reply(Boom.badRequest(ERRORS.ALREADY_SIGNED_IN));
                return;
            }

            const {email, password} = request.payload as RequestPayload.RegisterUser;

            // TODO SECURITY add rate limiting, ip throttling to prevent (D)DOS
            create_user({email, password}, server)
            .then((new_registered_user_payload) => {

                reply(new_registered_user_payload);
            })
            .catch((error) => {

                if (error.isBoom) {

                    reply(error);
                }
                else {

                    // Really bad implementation.  Should never get here.
                    server.log(LOG_TAGS.EXCEPTION, "EXCEPTION: unhandled error whilst registering user: ", error);
                    reply(Boom.badImplementation("Error registering user"));
                }
            });
        },
    };

    server.route({
        path: PATHS.API_V1.USER_REGISTER,
        method: "POST",
        config: config,
    });
};
