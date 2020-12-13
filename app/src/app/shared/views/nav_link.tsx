import * as React from "react"
import { NavLink, LinkProps } from "react-router-dom"

import { ReactComponentBase } from "@ajp/utils-ts/react"

export default class NavLinkCustom extends ReactComponentBase<LinkProps, {}> {
    render() {
        return <NavLink {...this.props} activeClassName="active_link"/>
    }
}
