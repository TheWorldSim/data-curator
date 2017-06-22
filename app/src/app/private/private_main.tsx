import * as React from "react";
import {Route} from "react-router-dom";

import {PATHS} from "../../shared/paths";
import {SignOutPage} from "./signout";
import {ProtectedPage} from "./protected/container";

export function routes () {
    return [
        <Route path={PATHS.SIGNOUT} component={SignOutPage} key="SIGNOUT"/>,
        <Route path={PATHS.PROTECTED} component={ProtectedPage} key="PROTECTED"/>,
    ];
}
