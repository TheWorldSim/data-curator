import {AppState} from "./state/shape";
import {STATUSES} from "./state/user_session/reducer";

// Which (virtual) app (routes) should render

export type App = "public" | "private" | "private_admin";

export function which_app(state: AppState): App {

    if (state.session.status === STATUSES.SIGNED_IN) {
        if (state.user.user!.is_admin) {
            return "private_admin";
        }
        else {
            return "private";
        }
    }
    else {
        return "public";
    }
}
