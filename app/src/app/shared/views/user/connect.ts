import { RouteComponentProps } from "react-router"
import { connect } from "react-redux"
import { ReactComponentBase } from "@ajp/utils-ts/react"

import { AppState } from "../../state/shape"
import { UserStateShape } from "../../state/user/shape"


const map_state_to_props = (state: AppState): UserStateShape => {
    return state.user
}


interface Props extends RouteComponentProps<{}>, UserStateShape {
}


export class UserContainer extends ReactComponentBase<Props, {}> {
}


export function connect_user(container: new(p: Props) => React.Component<Props, {}>) {
    const ConnectedContainer = connect(map_state_to_props)(container)
    return ConnectedContainer
}
