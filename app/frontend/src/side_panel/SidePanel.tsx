import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { Objects } from "./Objects"
import { Patterns } from "./Patterns"
import { Statements } from "./Statements"


interface OwnProps {}


const map_state = (state: RootState) => ({
    route: state.routing.route
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _SidePanel (props: Props)
{
    return <div>
        {props.route === "filter" && <div>
            Filter
        </div>}

        {props.route === "statements" && <Statements />}

        {props.route === "objects" && <Objects />}

        {props.route === "patterns" && <Patterns />}

        {props.route === "creation_context" && <div>
            Set Creation Context:
        </div>}
    </div>
}


export const SidePanel = connector(_SidePanel) as FunctionComponent<OwnProps>