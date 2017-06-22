import * as Hapi from "hapi";

import {ResponsePayload} from "../../../shared/api";
import {HapiAuthCookie} from "../user_session/hapi_auth_cookie";

export function get_session_bootstrap(request: Hapi.Request) {

    let session: ResponsePayload.SignInSuccess | ResponsePayload.SignOutSuccess = {
        status: "SIGNED_OUT",
    };

    if (request.auth.isAuthenticated) {
        session = {
            status: "SIGNED_IN",
            data: request.auth.credentials as HapiAuthCookie.CachedCredentials,
        };
    }

    return session;
}
