import * as React from "react";

import {connect_to_all_state, StateMappedToProps, Base} from "../base";
import {which_app} from "../../which_app";
import {SharedRoutes} from "./shared_routes";
import RedirectTo from "./redirect_to";

import {routes as private_routes} from "../../../private/private_main";
import {routes as private_admin_routes} from "../../../private_admin/private_admin_main";
import {routes as public_routes} from "../../../public/public_main";

/**
 * Session specific routes
 *
 * Once ejected from create-react-app, the app can be made to have 3 entry
 * points and this file can be removed.
 */
class UnconnectedSessionSpecificRoutes extends Base {

    shouldComponentUpdate(next_props: StateMappedToProps) {
        /**
         * This refers to public (user not signed in) vs private (user signed
         * in) which also includes admin app).
         */
        const current_app = which_app(this.props.state);
        const next_app = which_app(next_props.state);
        const different_apps = current_app !== next_app;
        // console.log("SessionSpecificRoutes different_apps...,: " +
        // `${different_apps}, current_app: ${current_app} next_app: ${next_app}`);
        return different_apps;
    }

    render() {

        let additional_routes: JSX.Element[];
        const app = which_app(this.props.state);

        if (app === "private" || app === "private_admin") {

            additional_routes = private_routes();

            if (app === "private_admin") {
                additional_routes = [
                    ...additional_routes,
                    ...private_admin_routes(),
                ];
            }
        }
        else {
            additional_routes = public_routes();
        }

        return <SharedRoutes additional_routes={additional_routes} not_found={RedirectTo}/>;
    }
}
export const ConnectedSessionSpecificRoutes = connect_to_all_state(UnconnectedSessionSpecificRoutes);
