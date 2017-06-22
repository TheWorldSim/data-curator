import {routerActions} from "react-router-redux";

import {PATHS} from "../../../../shared/paths";
import {dispatch} from "../store";
import {ACTIONS, Actions} from "../actions";

export function set_path_after_signinout (path_after_signinout: string) {

    const action: Actions.PathAfterSignInOut = {
        type: ACTIONS.PATH_AFTER_SIGNINOUT,
        path_after_signinout,
    };
    dispatch(action);
}

export function nav_signin_with_redirect (path_after_signinout: string) {
    set_path_after_signinout(path_after_signinout);
    navigate(PATHS.SIGNIN);
}

/**
 * @param path
 * @param replace   If true, this causes the current url to be replaced with
 *                  that given by path param.  Used when navigating back would
 *                  cause a nagivation loop returning user to the first url.
 */
export function navigate (path: string, replace: boolean = false) {
    // console.log(`Calling _navigate with: "${path}"`);
    const routeActionFn = replace ? routerActions.replace : routerActions.push;
    const routeAction = routeActionFn(path);
    dispatch(routeAction);
}

export function nav_goBack () {
    // console.log("Calling nav_goBack");
    dispatch(routerActions.goBack());
}
