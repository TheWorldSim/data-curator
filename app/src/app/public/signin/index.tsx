import * as React from "react";

import CONFIG from "../../../shared/config";
import {ConnectedDecoratedSignInForm as SignInForm} from "./form";

export function SignInPage () {

    return (
    <div>
        <h1>Sign in to {CONFIG.APP_NAME}</h1>
        <SignInForm />
    </div>);
}
