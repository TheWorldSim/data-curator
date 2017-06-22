// import * as Immutable from "immutable";
// import * as deepFreeze from "deep-freeze";

import {State as RegistrationStateShape} from "./user_registration/reducer";
import {State as SessionStateShape} from "./user_session/reducer";
import {State as UserStateShape} from "./user/shape";
import {State as ProtectedStateShape} from "./protected/reducer";

export type UserRegistrationFormDataShape = {
    email: string;
    password: string;
};

export type UserSignInFormDataShape = UserRegistrationFormDataShape;

interface PluginState {
    // tslint:disable-next-line
    routing: any;
    form: {
        user_signup: { values?: UserRegistrationFormDataShape; };
        user_signin: { values?: UserSignInFormDataShape; };
    };
}

export interface AppState {
    registration: RegistrationStateShape;
    path_after_signinout: string;
    session: SessionStateShape;
    user: UserStateShape;
    protected: ProtectedStateShape;
}

export interface AllAppState extends PluginState, AppState {
}
