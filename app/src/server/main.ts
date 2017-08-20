import * as Hapi from "hapi";
const Good = require("good");
const HapiAuthCookie = require("hapi-auth-cookie");

import CONFIG from "../shared/config";
import {LOG_TAGS} from "../shared/constants";
import PRIVATE_SERVER_CONFIG from "./private_server_config";
import GoodOptions from "./utils/good";
import * as Session from "./views/user_session/routes";
import * as Registration from "./views/user_registration/routes";
import * as Protected from "./views/protected/routes";
import * as BootStrap from "./views/bootstrap/routes";

const base_server = new Hapi.Server({
    debug: {},
    connections: {
        routes: {
            cors: CONFIG.ENV_DEVELOPMENT ? ({
                // Also allows API calls from server code as these have origin ''
                origin: ["http://localhost:3000"],  // address of webpack dev server
                credentials: true,
            }) : false,
        },
    },
});

/**
 * Override global console.log console.error
 * Can not override in tests as they are used by jest for logging out errors.
 */

if (!CONFIG.ENV_TEST) {

    console.log = function(message: string, arg2?: string) {

        if (arg2) {
            base_server.log(LOG_TAGS.EXCEPTION, "console.log called with second " +
                "argument from : " + (new Error().stack) + "\n\n>>>>> Pass single argument. <<<<<\n");
            message += JSON.stringify(arg2);
        }

        // Special case POSTGRES for now and allow it to use the app server log
        // mechanism.  TODO: have sequelize logger manage it's own file
        if (message.startsWith("POSTGRES:")) {
            base_server.log(LOG_TAGS.DATABASE, message);
            return;
        }

        base_server.log(LOG_TAGS.EXCEPTION, "console.log called from: " +
            (new Error().stack) + "\n\n>>>>> Use server.log() instead. <<<<<\n");
        base_server.log(LOG_TAGS.INFO, message);
    };

    console.error = function(message: string, arg2?: string) {

        if (arg2) {
            base_server.log(LOG_TAGS.EXCEPTION, "console.log called with second " +
                "argument from : " + (new Error().stack) + "\n Pass single argument.");
            message += JSON.stringify(arg2);
        }

        base_server.log(LOG_TAGS.EXCEPTION, "console.error called from: " +
            (new Error().stack) + "\nUse server.log() instead.");
        base_server.log(LOG_TAGS.EXCEPTION, message);
    };
}

// Set up connection

base_server.connection({
    port: PRIVATE_SERVER_CONFIG.SERVER_PORT,
    host: PRIVATE_SERVER_CONFIG.SERVER_HOST,
});

/**
 * throws if unsuccessful (tests and server should fail hard)
 * @param plugins
 */
function plugins_and_routes (plugins: Hapi.PluginRegistrationObject<{}>[]): Promise<Hapi.Server> {

    return new Promise<Hapi.Server>((resolve) => {

        base_server.register(plugins, (err) => {
            if (err) {
                throw err;
            }

            Session.routes(base_server);
            Registration.routes(base_server);
            Protected.routes(base_server);
            BootStrap.routes(base_server);

            resolve(base_server);
        });
    });
}

const plugins: Hapi.PluginRegistrationObject<{}>[] = [
    HapiAuthCookie,
];

const plugins_not_for_tests: Hapi.PluginRegistrationObject<{}>[] = [
    {register: Good, options: GoodOptions},
    ...plugins,
];

if (require.main === module) {

    plugins_and_routes(plugins_not_for_tests)
    .then((server) => {

        server.start((err) => {
            if (err) { throw err; }
            server.log(LOG_TAGS.INFO, `Server running at: ${server.info!.uri}`);
        });
    });
}

let resolve_server_for_tests: (server: Hapi.Server) => void;
/**
 * throws if unsuccessful (tests and server should fail hard)
 */
let promised_server_for_tests: Promise<Hapi.Server> = new Promise<Hapi.Server>((resolve) => {
    resolve_server_for_tests = resolve;
});

let setup_server_for_tests = false;
export function get_server_for_tests (): Promise<Hapi.Server> {

    if (!setup_server_for_tests) {
        plugins_and_routes(plugins)
        .then((server) => {

            // Need to call initialize to finalise plugins and start cache
            server.initialize((err) => {

                if (err) {
                    throw err;
                }

                resolve_server_for_tests(server);
            });
        });
        setup_server_for_tests = true;
    }

    return promised_server_for_tests;
}
