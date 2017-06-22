import {Reducer} from "redux";
import reduceReducers = require("reduce-reducers");
import {str_enum} from "@ajp/utils-ts/utils";

import {ACTIONS, Actions} from "../actions";
import {FETCH_STATE, FETCH_STATES} from "../util";
export {FETCH_STATE, FETCH_STATES} from "../util";

export interface State {
    data: string | undefined;
    status: FETCH_STATE;
}

// reducers

function init_state (state: State) {

    if (!state) {
        state = {
            data: undefined,
            status: FETCH_STATES.IDLE,
        };
    }
    return state;
}

function protected_data_requested (state: State, action: Actions.ProtectedDataRequested) {

    if (action.type === ACTIONS.PROTECTED_DATA_REQUESTED) {
        state = {
            status: FETCH_STATES.FETCHING,
            data: undefined,
        };
    }
    return state;
}

function protected_data_request_success (state: State, action: Actions.ProtectedDataRequestSuccess) {

    if (action.type === ACTIONS.PROTECTED_DATA_REQUEST_SUCCESS) {
        state = {
            status: FETCH_STATES.FETCH_SUCCESS,
            data: action.response,
        };
    }
    return state;
}

function protected_data_request_failed (state: State, action: Actions.ProtectedDataRequestFailed) {

    if (action.type === ACTIONS.PROTECTED_DATA_REQUEST_FAILED) {
        state = {
            status: FETCH_STATES.FETCH_FAILED,
            data: undefined,
        };
    }
    return state;
}

const reducers: Reducer<State>[] = [
    init_state,
    protected_data_requested,
    protected_data_request_success,
    protected_data_request_failed,
];

export const reducer = reduceReducers(...reducers);
