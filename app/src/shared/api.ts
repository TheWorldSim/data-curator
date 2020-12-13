import * as Boom from "boom";
import * as Joi from "joi";

import CONFIG from "./config";
import {User_OwnerView} from "./models/user";

export namespace RequestPayload {
    const email_validation = Joi.string().required().email();
    /**
     * TODO search for joi validation for common (poor) passwords, like
     * "pass", "passwordpassword" or "12345678"
     */
    const password_validation = Joi.string().required()
        .min(CONFIG.MIN_PASSWORD_LENGTH)

    export interface RegisterUser {
        email: string;
        password: string;
    }
    export const validate_register_user = Joi.object().keys({
        email: email_validation.max(CONFIG.MAX_EMAIL_LENGTH),
        password: password_validation,
    });

    export interface UserSignIn {
        username_or_email: string;
        password: string;
    }
    export const validate_user_sign_in = Joi.object().keys({
        username_or_email: email_validation,
        password: password_validation,
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
