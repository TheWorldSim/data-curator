import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Route, Redirect, Switch} from "react-router-dom";
import {ConnectedRouter} from "react-router-redux";

import {PATHS} from "../../../../shared/paths";
import {history} from "../../state/store";
import PublicHome from "../home/home";
import {RouteLegals} from "../legal/routes";
import {AppContainer} from "./app_container";

interface Props {
    session_specific_routes: JSX.Element[];
    not_found: React.ComponentClass<RouteComponentProps<{}>>;
}

export function SharedRoutes(props: Props) {

    return (
    <ConnectedRouter history={history}>
        <AppContainer>
            <Switch>
                <Redirect from="/public/index.html" to={PATHS.HOME}/>
                <Redirect from="/index.html" to={PATHS.HOME}/>

                <Route path={PATHS.HOME} exact={true} component={PublicHome} key="PublicHome"/>

                {...RouteLegals}

                {...props.session_specific_routes}

                <Route component={props.not_found} key="NotFound"/>
            </Switch>
        </AppContainer>
    </ConnectedRouter>);
}
