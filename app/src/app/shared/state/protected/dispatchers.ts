import {PATHS} from "../../../../shared/paths";

import {Actions, ACTIONS} from "../actions";
import {dispatch} from "../store";
import {STATUSES as USER_SESSION_STATES, State as UserSessionState} from "../user_session/reducer";
import {FETCH_STATES, State as ProtectedDataState} from "./reducer";
import {fetch} from "../store_util";

export function get_protected_resources (protected_data: ProtectedDataState, user_session: UserSessionState) {

    const status_p = protected_data.status;
    if (status_p === FETCH_STATES.FETCHING || status_p === FETCH_STATES.FETCH_SUCCESS) {
        console.log("Unable to fetch protected resources whilst already fetching or succeeded");
        return;
    }

    if (user_session.status !== USER_SESSION_STATES.SIGNED_IN) {
        console.error("Unable to fetch protected resources without being signed in: " + user_session.status);
        return;
    }

    fetch({
        path: PATHS.API_V1.PROTECTED,
        method: "GET",
        success_action: ACTIONS.PROTECTED_DATA_REQUEST_SUCCESS,
        failure_action: ACTIONS.PROTECTED_DATA_REQUEST_FAILED,
    });

    const action: Actions.ProtectedDataRequested = {
        type: ACTIONS.PROTECTED_DATA_REQUESTED,
    };
    dispatch(action);
}
