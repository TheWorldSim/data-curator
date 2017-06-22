import {BaseErrorPage} from "./base";

export class InternalServerException500Error extends BaseErrorPage {

    get_error_code() {
        return "500";
    }

    get_title() {
        const titles = ["Internal Exception"];
        return titles[Math.floor(Math.random() * titles.length)];
    }

    get_sub_title(url: string) {
        let msg = "Sorry it looks like we've had an error";
        msg += url ? " on:" : ".";
        return msg;
    }
}
