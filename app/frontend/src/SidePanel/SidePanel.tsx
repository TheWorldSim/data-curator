import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { Patterns } from "./Patterns"
import { Statements } from "./Statements"


const map_state = (state: RootState) => ({
    route: state.routing.route
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _SidePanel (props: Props)
{
    return <div>
        {props.route === "filter" && <div>
            Filter
        </div>}

        {props.route === "statements" && <Statements />}

        {props.route === "objects" && <div>
            Add Objects:
        </div>}

        {props.route === "patterns" && <Patterns />}

        {props.route === "creation_context" && <div>
            Set Creation Context:
        </div>}
    </div>
}


export const SidePanel = connector(_SidePanel)
