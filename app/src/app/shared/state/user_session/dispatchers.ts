import {PATHS} from "../../../../shared/paths";
import {routerActions} from "react-router-redux";
import {RequestPayload, ResponsePayload} from "../../../../shared/api";

import {Actions, ACTIONS} from "../actions";
import {dispatch, app_store} from "../store";
import {STATUSES} from "./reducer";
import {fetch} from "../store_util";

/**
 * The returned promise isn't used in frontend code, only in tests
 */
export function signin(signin_details: RequestPayload.SignIn): Promise<ResponsePayload.SignInSuccess> {

    let state = app_store.getState().session;
    if (state.status !== STATUSES.SIGNED_OUT) {
        console.error("Can not sign in unless signed out.");
        return Promise.reject(undefined);
    }

    function success_action(response_data: ResponsePayload.SignInSuccess, text_status: string) {

        /**
         * TODO, remove this hacky and make first two into atomic state change
         * and third into an action that's always dispatched after the page as
         * redirected.  Or pass the path_after_signinout in the query object of
         * the route.
         * Currently the user will be redirected to
         * state.path_after_signinout (PATH_AFTER_SIGNINOUT) which will attempt to
         * render and likely momentarily show a "You're not signed in, you need
         * to sign in page".  Then the page will be rerendered as the
         * signin_success action goes through and available routes are changed.
         *
         * Finally it will rerender a third time as the `path_after_signinout` is reset
         *
         * It's [not possible to use `redux-batched-actions`](https://github.com/ReactTraining/react-router/issues/5227)
         * with `react-router-redux`.
         */
        const path_after_signin = app_store.getState().path_after_signinout;
        dispatch(routerActions.push(path_after_signin));
        dispatch({
            type: ACTIONS.SIGNIN_SUCCESS,
            response: response_data,
        } as Actions.SignInSuccessAction);

        const reset_path_after_signin: Actions.PathAfterSignInOut = {
            type: ACTIONS.PATH_AFTER_SIGNINOUT,
            path_after_signinout: "",
        };
        dispatch(reset_path_after_signin);
    }

    const promised_fetch = fetch<ResponsePayload.SignInSuccess>({
        path: PATHS.API_V1.SIGNIN,
        method: "POST",
        success_action,
        failure_action: ACTIONS.SIGNIN_FAILED,
        data: signin_details,
    });

    const action: Actions.SignInRequestAction = {
        type: ACTIONS.SIGNIN_REQUESTED,
    };
    dispatch(action);
    return promised_fetch;
}

/**
 * The returned promise isn't used in frontend code, only in tests
 */
export function signout(): Promise<ResponsePayload.SignOutSuccess> {

    let state = app_store.getState().session;
    if (state.status !== STATUSES.SIGNED_IN) {
        console.error("Can not sign out unless signed in.");
        return Promise.reject(undefined);
    }

    function success_action(response_data: ResponsePayload.SignOutSuccess, text_status: string) {

        /**
         * TODO: Same comment as for `signin` `success_action`.
         */
        const path_after_signout = app_store.getState().path_after_signinout;
        dispatch(routerActions.push(path_after_signout));
        dispatch({
            type: ACTIONS.SIGNOUT_SUCCESS,
        } as Actions.SignOutSuccessAction);

        const reset_path_after_signout: Actions.PathAfterSignInOut = {
            type: ACTIONS.PATH_AFTER_SIGNINOUT,
            path_after_signinout: "",
        };
        dispatch(reset_path_after_signout);
    }

    const promised_fetch = fetch<ResponsePayload.SignOutSuccess>({
        path: PATHS.API_V1.SIGNOUT,
        method: "POST",
        success_action,
        failure_action: ACTIONS.SIGNOUT_ERRED,
        data: undefined,
    });

    const action: Actions.SignOutRequestAction = {
        type: ACTIONS.SIGNOUT_REQUESTED,
    };
    dispatch(action);
    return promised_fetch;
}
