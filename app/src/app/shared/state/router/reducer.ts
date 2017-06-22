import {PATHS} from "../../../../shared/paths";
import {Actions, ACTIONS} from "../actions";

const default_state = PATHS.HOME;

function path_after_signinout (state: string = default_state, action: Actions.PathAfterSignInOut) {

    if (action.type === ACTIONS.PATH_AFTER_SIGNINOUT) {
        state = action.path_after_signinout || default_state;
    }
    return state;
}

export const reducer = path_after_signinout;
