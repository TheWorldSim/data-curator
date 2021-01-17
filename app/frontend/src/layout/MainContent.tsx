import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { Planning } from "../planning/Planning"
import type { RootState } from "../state/State"


interface OwnProps {}


const map_state = (state: RootState) => {

    return {
        is_plannning: state.routing.args.view === "planning",
        other_view: state.routing.args.view,
    }
}


const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _MainContent (props: Props)
{
    if (props.is_plannning) return <Planning />

    return <div>
        View is: "{props.other_view}"
    </div>
}


export const MainContent = connector(_MainContent) as FunctionComponent<OwnProps>
