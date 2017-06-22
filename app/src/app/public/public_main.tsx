import * as React from "react";
import {Route} from "react-router-dom";

import {PATHS} from "../../shared/paths";
import {SignInPage} from "./signin";
import {ConnectedRegistrationPage as RegistrationPage} from "./registration";

export function routes () {
    return [
        <Route path={PATHS.USER_REGISTER} component={RegistrationPage} key="USER_REGISTER"/>,
        <Route path={PATHS.SIGNIN} component={SignInPage} key="SIGNIN"/>,
    ];
}
