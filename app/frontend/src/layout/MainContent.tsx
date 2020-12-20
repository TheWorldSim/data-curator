import { h } from "preact"

import type { RootState } from "../state/State"
import { connect, ConnectedProps } from "react-redux"


const map_state = (state: RootState) => ({
    selected_tab: state.tabs.selected_tab
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _MainContent (props: Props)
{
    return <div>
        {props.selected_tab === "statements" && <div>
            Statements
        </div>}

        {props.selected_tab === "desired_states" && <div>
            Desired states
        </div>}
    </div>
}


export const MainContent = connector(_MainContent)
