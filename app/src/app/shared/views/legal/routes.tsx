import * as React from "react";
import {Route} from "react-router";

// import {RxBase, connect_to_all_state_for_routes} from "../base";
import {PATHS} from "../../../../shared/paths";

import {LegalsIndex} from "./index";
import {LegalsCookiePolicy} from "./cookie_policy";

export const RouteLegals = [
    <Route path={PATHS.LEGAL_INDEX} exact={true} component={LegalsIndex} key="LEGAL_INDEX"/>,
    <Route path={PATHS.LEGAL_COOKIE_POLICY} component={LegalsCookiePolicy} key="LEGAL_COOKIE_POLICY"/>,
];
