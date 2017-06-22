import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import {ReactComponentBase} from "@ajp/utils-ts/react";

import {AppState} from "../../state/shape";
import {State} from "../../state/protected/reducer";

const map_state_to_props = (state: AppState): State => {
    return state.protected;
};

export interface Props extends RouteComponentProps<{}>, State {
}

export class ProtectedDataContainer extends ReactComponentBase<Props, {}> {
}

export function connect_protected_data(container: new(p: Props) => React.Component<Props, {}>) {
    const ConnectedContainer = connect(map_state_to_props)(container);
    return ConnectedContainer;
}
