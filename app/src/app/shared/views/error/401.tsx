import {BaseErrorPage} from "./base";

export class NotAuthorised401Error extends BaseErrorPage {

    get_error_code() {
        return "401";
    }

    get_title() {
        return "Not authorised";
    }

    get_sub_title(url: string) {
        let msg = "You're not authorised";
        msg += url ? " to see the following page:" : ".";
        return msg;
    }
}
