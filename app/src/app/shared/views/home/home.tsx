import * as React from "react";

import CONFIG from "../../../../shared/config";
import {PATHS} from "../../../../shared/paths";

import {BaseForRoutes, connect_to_all_state_for_routes} from "../base";
import NavLinkCustom from "../nav_link";
require("./home.css");
const logo = require("../images/logo.svg");

class PublicHome extends BaseForRoutes {

    render() {

        let user = this.props.state.user.user;
        let action_elements = <div/>;
        const space = <span>&nbsp; &nbsp; &nbsp;</span>;

        if (user) {
            action_elements = (
            <div>
                Welcome back {user.email} {space}
                <NavLinkCustom to={PATHS.PROTECTED}>See protected stuff</NavLinkCustom>
            </div>);
        }
        else {
            action_elements = (
            <div>
                <NavLinkCustom to={PATHS.SIGNIN}>SIGN IN</NavLinkCustom> {space}
                <NavLinkCustom to={PATHS.USER_REGISTER}>SIGN UP FOR BETA</NavLinkCustom>
            </div>);
        }

        return (
        <div className="public_home">
            <div className="gap"/>
            <div>
                <img src={logo} alt={`${CONFIG.APP_NAME} logo`} className="logo"/>
                <h1>It's {CONFIG.APP_NAME} time</h1>
                <div className="dash"/>
                <div className="gap"/>
                <p>{CONFIG.APP_NAME}, plan better, work better.</p>

                {action_elements}
            </div>
        </div>);
    }
}

export default connect_to_all_state_for_routes(PublicHome);
