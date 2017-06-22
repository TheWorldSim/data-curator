import {as_string, as_int} from "./utils/process_env";

const NODE_ENV = as_string(process.env.NODE_ENV);
const SERVER_SCHEME = as_string(process.env.REACT_APP_SERVER_SCHEME);
const IS_SECURE = SERVER_SCHEME === "https";
if (!IS_SECURE && SERVER_SCHEME !== "http") {
    throw new Error(`Invalid env variables, SERVER_SCHEME must be http or https but was: ${SERVER_SCHEME}`);
}
const SERVER_PORT = as_int(process.env.REACT_APP_SERVER_PORT);
const SERVER_HOST = as_string(process.env.REACT_APP_SERVER_HOST);
const SERVER_URI = `${SERVER_SCHEME}://${SERVER_HOST}:${SERVER_PORT}`;

const ENV_DEVELOPMENT = NODE_ENV === "development";
const ENV_TEST =        NODE_ENV === "test";
const ENV_STAGING =     NODE_ENV === "staging";
const ENV_PRODUCTION =  NODE_ENV === "production";

export default {
    NODE_ENV,
    ENV_DEVELOPMENT,
    ENV_TEST,
    ENV_STAGING,
    ENV_PRODUCTION,
    IS_SECURE,
    SERVER_URI,
    SERVER_SCHEME,
    SERVER_HOST,
    SERVER_PORT,
    APP_ID:              as_string(process.env.REACT_APP_APP_ID),
    APP_NAME:            as_string(process.env.REACT_APP_APP_NAME),
    SUPPORT_EMAIL:       as_string(process.env.REACT_APP_SUPPORT_EMAIL),
    COMPANY_NAME:        as_string(process.env.REACT_APP_COMPANY_NAME),
    MIN_PASSWORD_LENGTH: as_int(process.env.REACT_APP_MIN_PASSWORD_LENGTH),
    LOG:                 as_int(process.env.REACT_APP_LOG),
    // Added max length to email as database is VARCHAR(255)
    MAX_EMAIL_LENGTH: 200,
    // TODO SECURITY research this
    // Added max password length, not sure if this helps mitigate some (D)DOS
    MAX_PASSWORD_LENGTH: 100,
    SESSION_EXPIRY_IN_MILLISECONDS: 3 * 24 * 60 * 60 * 1000,  // 3 days
    SESSION_KEEP_ALIVE: true,
};
