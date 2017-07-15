import * as Boom from "boom";
import * as Joi from "joi";

import CONFIG from "./config";
import {User_OwnerView} from "./models/user";

export namespace RequestPayload {
    export interface RegisterUser {
        email: string;
        password: string;
    }
    export const Validate_RegisterUser = Joi.object().keys({
        email: Joi.string().required().email().max(CONFIG.MAX_EMAIL_LENGTH),
        /**
         * TODO search for joi validation for common (poor) passwords, like
         * "pass", "passwordpassword" or "12345678"
         */
        password: Joi.string().required()
            .min(CONFIG.MIN_PASSWORD_LENGTH)
            .max(CONFIG.MAX_PASSWORD_LENGTH),
    });

    export interface UserSignIn {
        username_or_email: string;
        password: string;
    }
    export const Validate_UserSignIn = Joi.object().keys({
        username_or_email: Joi.string().required().email(),
        password: Joi.string().required()
            .min(CONFIG.MIN_PASSWORD_LENGTH)
            .max(CONFIG.MAX_PASSWORD_LENGTH),
    });
}

export namespace ResponsePayload {

    export interface BootStrap {
        session: SignInSuccess | SignOutSuccess;
    }

    // User registration
    export interface RegisterUserSuccess {
        data: User_OwnerView;
    }
    export type RegisterUserFailed = Boom.Payload;

    // Sessions
    export interface SignInSuccess {
        status: "SIGNED_IN";
        data: {
            user: User_OwnerView;
        };
    }
    export interface SignOutSuccess {
        status: "SIGNED_OUT";
    }
    export type SignOutErred = Boom.Payload;

    // A protected resource
    export type ProtectedData = string;
}
