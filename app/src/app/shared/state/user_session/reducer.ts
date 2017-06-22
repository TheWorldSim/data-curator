import * as _ from "lodash";
import {Reducer} from "redux";
import reduceReducers = require("reduce-reducers");
import {str_enum} from "@ajp/utils-ts/utils";

import {ACTIONS, Actions} from "../actions";
import {get_bootstrapped_data} from "../bootstrap";

export const STATUSES = str_enum(["SIGNED_OUT", "SIGNING_IN", "SIGNED_IN", "SIGNING_OUT"]);
export type STATUS = keyof typeof STATUSES;

export interface State {
    status: STATUS;
    last_signout_erred: boolean;
    last_failed_signin: {
        status_text: string | undefined;
        status_code: number | undefined;
    } | {
        status_text?: undefined;
        status_code?: undefined;
    };
}

function init_state (state: State) {

    if (!state || _.keys(state).length === 0) {

        const bootstrap = get_bootstrapped_data();
        const status = bootstrap && bootstrap.session.status === "SIGNED_IN" ? STATUSES.SIGNED_IN : STATUSES.SIGNED_OUT;
        state = {
            status,
            last_signout_erred: false,
            last_failed_signin: {},
        };
    }
    return state;
}

function request_signin (state: State, action: Actions.SignInRequestAction) {

    if (action.type === ACTIONS.SIGNIN_REQUESTED) {
        if (state.status !== STATUSES.SIGNED_OUT) {
            // Reason this logic check is here: http://stackoverflow.com/questions/43656182
            console.error(`INVALID STATE in request_signin reducer: ${state.status}`);
        }

        state = {
            ...state,
            status: STATUSES.SIGNING_IN,
        };
    }
    return state;
}

function signin_success (state: State, action: Actions.SignInSuccessAction) {

    if (action.type === ACTIONS.SIGNIN_SUCCESS) {
        if (state.status !== STATUSES.SIGNING_IN) {
            // Reason this logic check is here: http://stackoverflow.com/questions/43656182
            console.error(`INVALID STATE in signin_success reducer: ${state.status}`);
        }

        state = {
            ...state,
            status: STATUSES.SIGNED_IN,
            last_failed_signin: {},
        };
    }
    return state;
}

function signin_failed (state: State, action: Actions.SignInFailedAction) {

    if (action.type === ACTIONS.SIGNIN_FAILED) {
        if (state.status !== STATUSES.SIGNING_IN) {
            // Reason this logic check is here: http://stackoverflow.com/questions/43656182
            console.error(`INVALID STATE in signin_failed reducer: ${state.status}`);
        }

        state = {
            ...state,
            status: STATUSES.SIGNED_OUT,
            last_failed_signin: {
                status_text: action.status_text,  // action.response!.error_message
                status_code: action.status_code,
            },
        };
    }
    return state;
}

function request_signout (state: State, action: Actions.SignOutRequestAction) {

    if (action.type === ACTIONS.SIGNOUT_REQUESTED) {
        if (state.status !== STATUSES.SIGNED_IN) {
            // Reason this logic check is here: http://stackoverflow.com/questions/43656182
            console.error(`INVALID STATE in request_signout reducer: ${state.status}`);
        }

        state = {
            ...state,
            status: STATUSES.SIGNING_OUT,
        };
    }
    return state;
}

function signout_success (state: State, action: Actions.SignOutSuccessAction) {

    if (action.type === ACTIONS.SIGNOUT_SUCCESS) {
        if (state.status !== STATUSES.SIGNING_OUT) {
            // Reason this logic check is here: http://stackoverflow.com/questions/43656182
            console.error(`INVALID STATE in signout_success reducer: ${state.status}`);
        }

        state = {
            ...state,
            status: STATUSES.SIGNED_OUT,
            last_signout_erred: false,
        };
    }
    return state;
}

function signout_erred (state: State, action: Actions.SignOutErredAction) {

    if (action.type === ACTIONS.SIGNOUT_ERRED) {
        if (state.status !== STATUSES.SIGNING_OUT) {
            // Reason this logic check is here: http://stackoverflow.com/questions/43656182
            console.error(`INVALID STATE in signout_erred reducer: ${state.status}`);
        }

        state = {
            ...state,
            status: STATUSES.SIGNED_OUT,
            last_signout_erred: true,
        };
    }
    return state;
}

const reducers: Reducer<State>[] = [
    init_state,
    request_signin,
    signin_success,
    signin_failed,
    request_signout,
    signout_success,
    signout_erred,
];

export const reducer = reduceReducers(...reducers);
