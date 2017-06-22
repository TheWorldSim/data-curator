import * as React from "react";

import CONFIG from "../../../../shared/config";
import {PATHS} from "../../../../shared/paths";
const logo = require("../images/logo.svg");
import NavLinkCustom from "../nav_link";

interface Props {
    signed_in: boolean;
    email_address?: string;
}

export function Header(props: Props) {

    const session_path = props.signed_in ? PATHS.SIGNOUT : PATHS.SIGNIN;
    const session_text = props.signed_in ? "Sign out" : "Sign in";

    const user_or_register = props.email_address ?
        <span className="nav_text">{props.email_address}</span> :
        <NavLinkCustom to={PATHS.USER_REGISTER}>Register</NavLinkCustom>;

    return (
    <header className="header">
        <NavLinkCustom to={PATHS.HOME}>
            <img src={logo} alt={`${CONFIG.APP_NAME} logo`} className="logo_small"/>
        </NavLinkCustom>
        {user_or_register} &nbsp;
        <NavLinkCustom to={session_path}>{session_text}</NavLinkCustom>
    </header>);
}
