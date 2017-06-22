import * as React from "react";

import CONFIG from "../../../shared/config";
import {SignOutForm} from "./form";

export function SignOutPage () {

    return (
    <div>
        <h1>Confirm Sign Out of {CONFIG.APP_NAME}</h1>
        <SignOutForm />
    </div>);
}
