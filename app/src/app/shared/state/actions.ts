import * as Redux from "redux";
import {ResponsePayload} from "../../../shared/api";
import {ERROR} from "../../../shared/errors";

export class ACTIONS {
    DEMO = "DEMO"
}

export interface Action extends Redux.Action {
    type: string;
}

export type Dispatch = Redux.Dispatch<Action>;

export namespace Actions {
    export interface DemoAction extends Action {
        some_date: Date;
        status_code: number;
        status_text: ERROR;
    }

}
