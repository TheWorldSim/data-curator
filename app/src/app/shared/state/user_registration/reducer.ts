import reduceReducers = require("reduce-reducers");
import {Reducer} from "redux";
import {str_enum} from "@ajp/utils-ts/utils";

import {ERROR} from "../../../../shared/errors";
import {ACTIONS, Actions} from "../actions";

export const STATES = str_enum([
    "not_registering",
    "registration_pending",
    "registered",
    "registration_error",
]);
type STATE = keyof typeof STATES;

export interface State {
    status: STATE;
    error: ERROR | undefined;
}

function init_state (state: State) {

    if (!state) {
        state = {
            status: STATES.not_registering,
            error: undefined,
        };
    }

    return state;
}

function request_register_user (state: State, action: Actions.RegisterUserSuccessAction) {

    if (action.type === ACTIONS.USER_REGISTRATION_REQUESTED) {
        state = {
            status: STATES.registration_pending,
            error: undefined,
        };
    }
    return state;
}

function register_user_success (state: State, action: Actions.RegisterUserSuccessAction) {

    if (action.type === ACTIONS.USER_REGISTRATION_SUCCESS) {
        state = {
            status: STATES.registered,
            error: undefined,
        };
    }
    return state;
}

function register_user_failed (state: State, action: Actions.RegisterUserFailedAction) {

    if (action.type === ACTIONS.USER_REGISTRATION_FAILED) {
        state = {
            status: STATES.registration_error,
            error: action.status_text,
        };
    }
    return state;
}

const reducers: Reducer<State>[] = [
    init_state,
    request_register_user,
    register_user_success,
    register_user_failed,
];

export const reducer = reduceReducers(...reducers);
