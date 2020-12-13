import { UserStateShape } from "./user/shape"


export type UserRegistrationFormDataShape = {
    email: string
    password: string
}


export type UserSignInFormDataShape = UserRegistrationFormDataShape


interface PluginState {
    // tslint:disable-next-line
    routing: any
}


export interface AppState {
    user: UserStateShape
}


export interface AllAppState extends PluginState, AppState {
}
