import * as React from "react";

import {STATUSES} from "../../state/user_session/reducer";
import {connect_to_all_state, Base} from "../base";
import {Header} from "./header";
import {Footer} from "./footer";

// App container

class UnconnectedAppContainer extends Base {

    render() {

        const state = this.props.state;
        const user = state.user.user;
        const header_props = {
            signed_in: state.session.status === STATUSES.SIGNED_IN,
            email_address: user && user.email,
        };

        return (
        <div>
            <Header {...header_props} />
            {this.props.children}
            {Footer}
        </div>);
    }
}

export const AppContainer = connect_to_all_state(UnconnectedAppContainer);
