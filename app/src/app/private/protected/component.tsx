import * as React from "react";

import CONFIG from "../../../shared/config";
import {State as ProtectedDataState} from "../../shared/state/protected/reducer";
import {State as UserSessionState} from "../../shared/state/user_session/reducer";
import {FETCH_STATES} from "../../shared/state/protected/reducer";
import {make_spinner} from "../../shared/views/utils";

export interface Props {
    protected: ProtectedDataState;
    user_session: UserSessionState;
}

export function ProtectedComponent (props: Props) {

    let content: JSX.Element;

    const protected_data_status = props.protected.status;
    if (protected_data_status === FETCH_STATES.IDLE || protected_data_status === FETCH_STATES.FETCHING) {
        content = <div>{make_spinner("Fetching protected data")}</div>;
    }
    else if (protected_data_status === FETCH_STATES.FETCH_SUCCESS) {
        content = <div>Protected data: {props.protected.data}</div>;
    }
    else {
        content = <div>ERROR please refresh to try again.</div>;
    }

    return (
    <div>
        <h1>Protected page on {CONFIG.APP_NAME}</h1>
        <div>
            If the code is not split into public and private
            (and private_admin) then this text will be publicly visible
            in the source however access to the following data will not:
            <div>
                {content}
            </div>
        </div>
    </div>);
}
