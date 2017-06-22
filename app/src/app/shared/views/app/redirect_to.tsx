import * as _ from "lodash";
import * as React from "react";

import * as DISPATCHERS from "../../state/router/dispatchers";
import {BaseForRoutes, connect_to_all_state_for_routes} from "../base";
import {NotFound404Error} from "../error";

class RedirectTo extends BaseForRoutes {

    private timer_id: number;

    remove_timer() {
        if (this.timer_id !== undefined) {
            clearTimeout(this.timer_id);
        }
    }

    componentWillUpdate() {
        this.remove_timer();
    }

    componentWillUnmount() {
        this.remove_timer();
    }

    render() {

        /**
         * TODO SECURITY review, check that there is no way malicious user input
         * that could cause a redirect to a different site.  For example this
         * could be used to trick users, they go to oursite.com/some_crafted_url
         * and end up at badsite.com (that looks very similar to our site).
         */
        const {pathname, search} = this.props.location;
        const full_path = (pathname || "") + (search || "");
        const status = this.props.state.session.status;

        if (status === "SIGNED_OUT") {

            this.timer_id = _.delay(() => {
                DISPATCHERS.nav_signin_with_redirect(full_path);
            }, 1000);  // TODO make delay 0 (i.e. `_.defer(...)`)

            return (
            <div>
                You may need to sign in to access "{full_path}".<br/>
                Redirecting you sign in page.
            </div>);
        }
        else if (status === "SIGNED_IN") {

            return <NotFound404Error errored_url={full_path} error_message="This page does not exist"/>;
        }
        else {

            // Wait for sign in / out to complete
            const adjective = status === "SIGNING_OUT" ? "out" : "in";
            this.timer_id = _.delay(() => {
                DISPATCHERS.navigate(full_path);
            }, 1200);

            return (
            <div>
                You are currently signing {adjective}.  Please wait. <br/>
                Refreshing to "{full_path}" shortly...
            </div>);
        }
    }
}

export default connect_to_all_state_for_routes(RedirectTo);
