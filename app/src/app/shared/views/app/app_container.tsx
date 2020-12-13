import * as React from "react"

import { connect_to_all_state, Base } from "../base"
import { Header, HeaderProps } from "./header"
import { Footer } from "./footer"

// App container

class UnconnectedAppContainer extends Base {

    render() {
        const header_props: HeaderProps = {
            signed_in: false,
            email_address: "",
        }

        return (
        <div>
            <Header {...header_props} />
            {this.props.children}
            {Footer}
        </div>)
    }
}

export const AppContainer = connect_to_all_state(UnconnectedAppContainer)
