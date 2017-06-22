import * as React from "react";

import CONFIG from "../../../shared/config";
import {ConnectedDecoratedSignInForm as SignInForm} from "../signin/form";

export function SignUpSuccess () {

    return (
    <div>
        <h1>Congratulations you've signed up to {CONFIG.APP_NAME}</h1>
        <div>Please now sign in below:</div>
        <br/>
        <SignInForm />
    </div>);
}
