import * as Hapi from "hapi";
import crypto = require("crypto");

import CONFIG from "../../../shared/config";
import {User_OwnerView} from "../../../shared/models/user";
import PRIVATE_SERVER_CONFIG from "../../private_server_config";
import {ServerAppData} from "../bootstrap/server_app";

export function hash_uuid(uuid: string) {
    return crypto.createHash("md5").update(uuid).digest("hex");
}

// Hapi Auth Cookie

export module HapiAuthCookie {
    export interface ValidateFunc {
        (
            request: Hapi.Request,
            session: {sid: string},
            callback: (err: Error | null, isValid: boolean, credentials?: CachedCredentials) => void
        ): void;
    }

    export interface CachedCredentials {
        user: User_OwnerView;
    }
}

declare module "hapi" {
    interface Request {
        cookieAuth: {
            set(val: { sid: string; }): void;
            clear(): void;
        };
    }
}

export function setup_hapi_auth_cookie(server: Hapi.Server) {

    const sessions_cache = server.cache({
        segment: "sessions_cache",
        expiresIn: CONFIG.SESSION_EXPIRY_IN_MILLISECONDS,
    });
    (server.app as ServerAppData).sessions_cache = sessions_cache;

    server.auth.strategy("session", "cookie", true, {
        password: PRIVATE_SERVER_CONFIG.ENCRYPTION_PASSWORD,
        isSecure: CONFIG.IS_SECURE,
        keepAlive: CONFIG.SESSION_KEEP_ALIVE,
        ttl: CONFIG.SESSION_EXPIRY_IN_MILLISECONDS,
        validateFunc: function (request, session, callback) {

            sessions_cache.get(session.sid, (err, cached: HapiAuthCookie.CachedCredentials) => {

                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached);
            });
        } as HapiAuthCookie.ValidateFunc,
    });
}
