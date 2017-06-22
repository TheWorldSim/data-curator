import * as Boom from "boom";
import * as Hapi from "hapi";

import {ResponsePayload} from "../../../shared/api";
import {ERRORS} from "../../../shared/errors";
import {LOG_TAGS} from "../../../shared/constants";
import {UserDb, UserDbFields} from "../../models/user/db";
import {owner_view} from "../../models/user/utils";
import {verify_against} from "../../utils/promised_hash_salt";

// Exception and Error factories

function promise_bad_implementation () {

    return Promise.reject(Boom.badImplementation("EXCEPTION during user logging in"));
}

function promise_email_or_password_not_recognised () {

    const unauthorised_error = Boom.unauthorized(ERRORS.EMAIL_OR_PASSWORD_NOT_RECOGNISED);
    return Promise.reject(unauthorised_error);
}

// Get user by email address

function get_user__for_web_api (email: string, server: Hapi.Server): Promise<UserDbFields> {

    return UserDb.findOne({where: {email}})
    .catch((error) => {

        server.log(LOG_TAGS.EXCEPTION, "EXCEPTION getting user by email:", error);
        return promise_bad_implementation();
    })
    .then((user_db_instance) => {

        if (!user_db_instance) {

            server.log(LOG_TAGS.SECURITY, `Could not find user with email: ${email} ` +
                "[potential security attack attempting to find registered emails]");
            return promise_email_or_password_not_recognised() as any as UserDbFields;  // tslint:disable-line
        }

        return user_db_instance.toJSON();
    });
}

interface Args {
    email: string;
    password: string;
}

// Check user email and password are valid

export function verify_password__for_web_api ({email, password}: Args, server: Hapi.Server):
    Promise<ResponsePayload.SignInSuccess> {

    return get_user__for_web_api(email, server)
    .then((user) => {

        const hash = user.password;
        // TODO SECURITY add rate limiting, ip throttling to prevent (D)DOS
        const promise_verification: Promise<ResponsePayload.SignInSuccess> = verify_against(password, hash)
        .then((verified) => {

            if (verified) {

                const response: ResponsePayload.SignInSuccess = {
                    status: "SIGNED_IN",
                    data: {
                        user: owner_view(user),
                    },
                };

                return Promise.resolve(response);
            }
            else {

                server.log(LOG_TAGS.SECURITY, `Found user ${user.uuid} by their email address but their password ` +
                    "did not match. [potential security attack attempting to guess password]");
                return promise_email_or_password_not_recognised();
            }
        }, (error) => {

            server.log(LOG_TAGS.EXCEPTION, "EXCEPTION verifying user's password:", error);
            return promise_bad_implementation();
        });

        return promise_verification;
    });
}
