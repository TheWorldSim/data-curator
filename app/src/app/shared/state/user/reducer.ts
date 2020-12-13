import reduceReducers = require("reduce-reducers")
import { Reducer } from "redux"

import { UserStateShape } from "./shape"
import { ACTIONS, Actions } from "../actions"
import { get_bootstrapped_data } from "../bootstrap"


function init_state (state: UserStateShape)
{

    if (!state)
    {

        const bootstrap = get_bootstrapped_data()
        const user = bootstrap && bootstrap.session.status === "SIGNED_IN" ? bootstrap.session.data.user : undefined
        state = {
            user,
        }
    }
    return state
}


// function user_signin_success (state: State, action: Actions.SignInSuccessAction)
// {

//     if (action.type === ACTIONS.SIGNIN_SUCCESS)
//     {
//         if (state.user)
//         {
//             console.error(`Trying to create new user: ${JSON.stringify(action.response.data)}
//             but already have user: ${JSON.stringify(state.user)}`)
//         }

//         const {user} = action.response.data
//         state = {
//             newly_registered_user_email: undefined,
//             user,
//         }
//     }
//     return state
// }


const reducers: Reducer<UserStateShape>[] = [
    init_state,
    // user_signin_success,
]

export const reducer = reduceReducers(...reducers)
