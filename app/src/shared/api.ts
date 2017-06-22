import * as Boom from "boom";

import {User_OwnerView} from "./models/user";

export namespace RequestPayload {
    export interface RegisterUser {
        email: string;
        password: string;
    }

    export interface SignIn {
        username_or_email: string;
        password: string;
    }
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

export const REQUEST_PAYLOAD_KEYS = {
    EMAIL_ADDRESS: "email",
    PASSWORD: "password",
    USER_UUID: "user_uuid",
};
