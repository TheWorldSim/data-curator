import * as React from "react";

import CONFIG from "../../../../shared/config";
import {PATHS} from "../../../../shared/paths";
import {copyright, style} from "../legal/copyright";
const logo = require("../images/logo.svg");
import NavLinkCustom from "../nav_link";

export const Footer = (
<footer className="footer">
    <div>
        <NavLinkCustom to={PATHS.HOME}>
            <img src={logo} alt={`${CONFIG.APP_NAME} logo`} className="logo_small"/>
        </NavLinkCustom>
        <span className="copyright">
            {copyright} &nbsp;
            <NavLinkCustom to={PATHS.LEGAL_INDEX} style={style}>LEGALS</NavLinkCustom>
        </span>
    </div>
</footer>);
