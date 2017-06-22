import * as Hapi from "hapi";

import {PATHS} from "../../shared/paths";
import {server_normal_user, PASSWORD} from "./user";

/**
 * Signin the `server_normal_user` by default
 * @return Promise resolved with string containing cookie_for_header
 */
export function signin_user (
    server: Hapi.Server, user?: {username_or_email: string, password: string}): Promise<string> {

    user = user || { username_or_email: server_normal_user().email, password: PASSWORD };

    const signin_request: Hapi.InjectedRequestOptions = {
        method: "POST",
        url: PATHS.API_V1.SIGNIN,
        payload: user,
    };

    return new Promise((resolve, reject) => {

        server.inject(signin_request, (res_signin) => {

            try {
                expect(res_signin.statusCode).toEqual(200);
            }
            catch (e) {
                const msg = "Error signing in: " + e;
                console.error(msg);
                reject(msg);
            }

            const header = res_signin.headers["set-cookie"];
            // Copied from https://github.com/hapijs/hapi-auth-cookie/blob/f697b7a49005e19ce6b61bb3506320/test/index.js
            const cookie = header[0].match(
              /(?:[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)\s*=\s*(?:([^\x00-\x20\"\,\;\\\x7F]*))/);
            const cookie_for_header = "sid=" + cookie![1];
            resolve(cookie_for_header);
        });
    });
}
