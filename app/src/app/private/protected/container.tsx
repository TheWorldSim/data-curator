import * as React from "react";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";

import {AppState} from "../../shared/state/shape";
import {FETCH_STATES} from "../../shared/state/protected/reducer";
import {get_protected_resources} from "../../shared/state/protected/dispatchers";
import {ProtectedComponent, Props as MappedProps} from "./component";

function map_state_to_props (state: AppState): MappedProps {

    return {
        protected: state.protected,
        user_session: state.session,
    };
}

export interface Props extends RouteComponentProps<{}>, MappedProps {
}

class UnconnectedProtectedPage extends React.Component<Props, {}> {

    componentDidMount() {

        if (this.props.protected.status === FETCH_STATES.IDLE) {
            /**
             * Not pure but the recommended way of fetching absent data.
             * Should only be called once on initial rendering, will be called
             * after `render` and will not be called on server (though the
             * conditional above ensures if it has the right state it this
             * dispatchers function would not be called anyway).
             */
            get_protected_resources(this.props.protected, this.props.user_session);
        }
    }

    render() {

        return <ProtectedComponent {...this.props}/>;
    }
}

export const ProtectedPage = connect(map_state_to_props)(UnconnectedProtectedPage);
