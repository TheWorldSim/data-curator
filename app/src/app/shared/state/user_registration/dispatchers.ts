import * as _ from "lodash";

import {Actions, ACTIONS} from "../actions";
import {PATHS} from "../../../../shared/paths";
import {RequestPayload} from "../../../../shared/api";
import {dispatch, app_store} from "../store";
import {STATUSES as SESSION_STATES} from "../user_session/reducer";
import {STATES as USER_REGISTRATION_STATES} from "./reducer";
import {fetch} from "../store_util";

export function register_new_user (registration_details: RequestPayload.RegisterUser): void {

    const state = app_store.getState();
    const registration_state = state.registration;
    const session_state = state.session;

    const already_registering = !_.includes([
        USER_REGISTRATION_STATES.not_registering,
        USER_REGISTRATION_STATES.registration_error,
    ], registration_state.status);
    const not_signed_out = session_state.status !== SESSION_STATES.SIGNED_OUT;
    if (already_registering || not_signed_out) {
        console.error("Can not sign up unless not registered already / signed out");
        return;
    }

    fetch({
        path: PATHS.API_V1.USER_REGISTER,
        method: "POST",
        success_action: ACTIONS.USER_REGISTRATION_SUCCESS,
        failure_action: ACTIONS.USER_REGISTRATION_FAILED,
        data: registration_details,
    });

    const action: Actions.UserRegistrationRequestAction = {
        type: ACTIONS.USER_REGISTRATION_REQUESTED,
        requested_user_registration_datetime: new Date(),
    };
    dispatch(action);
}
