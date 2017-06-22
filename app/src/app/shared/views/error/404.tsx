import {BaseErrorPage} from "./base";

export class NotFound404Error extends BaseErrorPage {

    get_error_code() {
        return "404";
    }

    get_title() {
        return "Page not found";
    }

    get_sub_title(url: string) {
        let msg = "Sorry we couldn't find";
        msg += url ? " the page at:" : " that page.";
        return msg;
    }
}
