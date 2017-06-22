import * as Hapi from "hapi";

import {setup_hapi_auth_cookie} from "./hapi_auth_cookie";
import {add_signin_route} from "./route_signin";
import {add_signout_route} from "./route_signout";

export function routes (server: Hapi.Server) {

    setup_hapi_auth_cookie(server);
    add_signin_route(server);
    add_signout_route(server);
}
