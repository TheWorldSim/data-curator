import * as Redux from "redux";
import {ResponsePayload} from "../../../shared/api";
import {ERROR} from "../../../shared/errors";

export class ACTIONS {
    static USER_REGISTRATION_REQUESTED = "USER_REGISTRATION_REQUESTED";
    static USER_REGISTRATION_SUCCESS   = "USER_REGISTRATION_SUCCESS";
    static USER_REGISTRATION_FAILED    = "USER_REGISTRATION_FAILED";

    static SIGNIN_REQUESTED  = "SIGNIN_REQUESTED";
    static SIGNIN_SUCCESS    = "SIGNIN_SUCCESS";
    static SIGNIN_FAILED     = "SIGNIN_FAILED";
    static SIGNOUT_REQUESTED = "SIGNOUT_REQUESTED";
    static SIGNOUT_SUCCESS   = "SIGNOUT_SUCCESS";
    static SIGNOUT_ERRED     = "SIGNOUT_ERRED";

    static PATH_AFTER_SIGNINOUT = "PATH_AFTER_SIGNINOUT";

    static PROTECTED_DATA_REQUESTED       = "PROTECTED_DATA_REQUESTED";
    static PROTECTED_DATA_REQUEST_SUCCESS = "PROTECTED_DATA_REQUEST_SUCCESS";
    static PROTECTED_DATA_REQUEST_FAILED  = "PROTECTED_DATA_REQUEST_FAILED";
}

export interface Action extends Redux.Action {
    type: string;
}

export type Dispatch = Redux.Dispatch<Action>;

export namespace Actions {
    export interface UserRegistrationRequestAction extends Action {
        requested_user_registration_datetime: Date;
    }
    export interface RegisterUserSuccessAction extends Action {
        response: ResponsePayload.RegisterUserSuccess;
    }
    export interface RegisterUserFailedAction extends Action {
        status_code: number;
        status_text: ERROR;
    }

    export interface SignInRequestAction extends Action {
    }
    export interface SignInSuccessAction extends Action {
        response: ResponsePayload.SignInSuccess;
    }
    export interface SignInFailedAction extends Action {
        status_code: number;
        status_text: string;
    }
    export interface SignOutRequestAction extends Action {
    }
    export interface SignOutSuccessAction extends Action {
        response: ResponsePayload.SignOutSuccess;
    }
    export interface SignOutErredAction extends Action {
        status_code: number;
        status_text: string;
    }

    export interface PathAfterSignInOut extends Action {
        path_after_signinout: string;
    }

    export interface ProtectedDataRequested extends Action {
    }
    export interface ProtectedDataRequestSuccess extends Action {
        response: ResponsePayload.ProtectedData;
    }
    export interface ProtectedDataRequestFailed extends Action {
    }

}
