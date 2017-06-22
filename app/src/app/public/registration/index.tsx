import * as React from "react";

import CONFIG from "../../../shared/config";
import {UserContainer, connect_user} from "../../shared/views/user/connect";
import SignUpForm from "./form";
import {SignUpSuccess} from "./success";

class RegistrationPage extends UserContainer {

    render() {
        console.log(`RegistrationPage rendering`);
        /**
         * This page should only be rendered on the public route so we don't
         * check if the session is also active.
         */
        const email = this.props.newly_registered_user_email;
        if (email) {
            return (
            <div>
                <SignUpSuccess />
            </div>);
        }

        return (
        <div>
            <h1>Sign up to {CONFIG.APP_NAME}</h1>
            <SignUpForm/>
        </div>);
    }
}

export const ConnectedRegistrationPage = connect_user(RegistrationPage);
