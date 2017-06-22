import {Reducer} from "redux";

import {BaseModel} from "../../../shared/models/base";
import {dispatch} from "../../../app/shared/state/store";
import {Actions, ACTIONS} from "../../../app/shared/state/actions";
import {ERRORS} from "../../../shared/errors";
import {api_normal_user} from "../../helper/user";

export function reset_store() {
    dispatch({ type: "RESET" });
}

export const signin_details = {
    username_or_email: "Charlie",
    password: "qwerty",
};

export function signin_request_action(): Actions.SignInRequestAction {
    return {
        type: ACTIONS.SIGNIN_REQUESTED,
    };
}

export function signin_success_action(): Actions.SignInSuccessAction {

    const user = api_normal_user();

    return {
        type: ACTIONS.SIGNIN_SUCCESS,
        response: {
            status: "SIGNED_IN",
            data: {
                user,
            }
        }
    };
}

export function signin_failed_action(): Actions.SignInFailedAction {
    return {
        type: ACTIONS.SIGNIN_FAILED,
        status_code: 401,
        status_text: ERRORS.EMAIL_OR_PASSWORD_NOT_RECOGNISED,
    };
}

export function signout_request_action(): Actions.SignOutRequestAction {
    return {
        type: ACTIONS.SIGNOUT_REQUESTED,
    };
}

export function signout_success_action(): Actions.SignOutSuccessAction {
    return {
        type: ACTIONS.SIGNOUT_SUCCESS,
        response: { status: "SIGNED_OUT" },
    };
}

export function signout_erred_action(): Actions.SignOutErredAction {
    return {
        type: ACTIONS.SIGNOUT_ERRED,
        status_code: 400,
        status_text: ERRORS.ALREADY_SIGNED_OUT,
    };
}

export function make_helpers<S>(reducer: Reducer<S>) {
    return {
        signin_request: (state: S): S => {
            return reducer(state, signin_request_action());
        },

        signin_success: (state: S): S => {
            return reducer(state, signin_success_action());
        },

        signin_failed: (state: S): S => {
            return reducer(state, signin_failed_action());
        },

        signout_request: (state: S): S => {
            return reducer(state, signout_request_action());
        },

        signout_success: (state: S): S => {
            return reducer(state, signout_success_action());
        },

        signout_erred: (state: S): S => {
            return reducer(state, signout_erred_action());
        },
    };
}

/**
 * Convert to string to simulate response from server
 */
export function JSON_date_to_string<T extends BaseModel>(model: T): T {

    // tslint:disable-next-line
    model.created_at = (model.created_at.toString() as any);
    // tslint:disable-next-line
    model.modified_at = (model.modified_at!.toString() as any);
    return model;
}
