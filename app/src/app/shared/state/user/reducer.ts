import reduceReducers = require("reduce-reducers");
import {Reducer} from "redux";

import {State} from "./shape";
import {ACTIONS, Actions} from "../actions";
import {get_bootstrapped_data} from "../bootstrap";

function init_state (state: State) {

    if (!state) {

        const bootstrap = get_bootstrapped_data();
        const user = bootstrap && bootstrap.session.status === "SIGNED_IN" ? bootstrap.session.data.user : undefined;
        state = {
            newly_registered_user_email: undefined,
            user,
        };
    }
    return state;
}

function register_user_success (state: State, action: Actions.RegisterUserSuccessAction) {

    if (action.type === ACTIONS.USER_REGISTRATION_SUCCESS) {
        if (state.newly_registered_user_email) {
            console.error(`Trying to add newly_registered_user_email: ${JSON.stringify(action.response.data.email)}
            but already have newly_registered_user_email: ${JSON.stringify(state.newly_registered_user_email)}`);
        }

        state = {
            newly_registered_user_email: action.response.data.email,
            user: undefined,
        };
    }
    return state;
}

function user_signin_success (state: State, action: Actions.SignInSuccessAction) {

    if (action.type === ACTIONS.SIGNIN_SUCCESS) {
        if (state.user) {
            console.error(`Trying to create new user: ${JSON.stringify(action.response.data)}
            but already have user: ${JSON.stringify(state.user)}`);
        }

        const {user} = action.response.data;
        state = {
            newly_registered_user_email: undefined,
            user,
        };
    }
    return state;
}

function user_signout_success (state: State, action: Actions.SignOutSuccessAction) {

    if (action.type === ACTIONS.SIGNOUT_SUCCESS) {
        if (!state.user) {
            console.error(`Trying to signout user but they don't exist.`);
        }

        state = {
            newly_registered_user_email: undefined,
            user: undefined,
        };
    }
    return state;
}

const reducers: Reducer<State>[] = [
    init_state,
    register_user_success,
    user_signin_success,
    user_signout_success,
];

export const reducer = reduceReducers(...reducers);
