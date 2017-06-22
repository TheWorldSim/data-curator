import {BaseErrorPage} from "./base";

export class BadRequest400Error extends BaseErrorPage {

    get_error_code() {
        return "400";
    }

    get_title() {
        return "Bad Request";
    }

    get_sub_title(url: string) {
        let msg = "Looks like something didn't work";
        msg += url ? " on:" : ".";
        return msg;
    }
}
