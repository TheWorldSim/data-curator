import * as React from "react";

import NavLinkCustom from "../nav_link";
import {PATHS} from "../../../../shared/paths";

export function LegalsIndex () {
    return (
    <div>
        <p><NavLinkCustom to={PATHS.LEGAL_COOKIE_POLICY}>Cookie policy</NavLinkCustom></p>
    </div>);
}
