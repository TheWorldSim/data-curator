import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Sequelize from "sequelize";

import {ERRORS} from "../../../shared/errors";
import {ResponsePayload} from "../../../shared/api";
import {LOG_TAGS} from "../../../shared/constants";
import {hash_password} from "../../utils/promised_hash_salt";
import {UserDb, UserDbInstance} from "../../models/user/db";
import {owner_view} from "../../models/user/utils";

function promise_bad_implementation () {
    return Promise.reject(Boom.badImplementation("Error registering user"));
}

interface Args {
    email: string;
    password: string;
}

// Create user

function create_user__for_web_api ({email, password}: Args, server: Hapi.Server): Promise<UserDbInstance> {

    // TODO SECURITY add rate limiting, ip throttling to prevent (D)DOS
    return hash_password(password)
    .catch((error) => {

        server.log(LOG_TAGS.EXCEPTION, "EXCEPTION: from HashSalt().hash()", error);
        return promise_bad_implementation;
    })
    .then((hashed_password: string) => {

        return UserDb.create({email, password: hashed_password})
        .catch((error) => {

            if (error instanceof Sequelize.UniqueConstraintError) {

                return Promise.reject(Boom.badRequest(ERRORS.EMAIL_ALREADY_REGISTERED));
            }

            server.log(LOG_TAGS.EXCEPTION, "EXCEPTION: from UserDb.create()", error);
            return promise_bad_implementation();
        });
    });
}

/**
 * Create a user
 * Wrap in API responses
 */
export function create_user (args: Args, server: Hapi.Server): Promise<ResponsePayload.RegisterUserSuccess> {

    return create_user__for_web_api(args, server)
    .then((user_db_instance) => {

        const user = user_db_instance.toJSON();
        const filtered_user = owner_view(user);
        const response: ResponsePayload.RegisterUserSuccess = {
            data: filtered_user,
        };
        return response;
    });
}
