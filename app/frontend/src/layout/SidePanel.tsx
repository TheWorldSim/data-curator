import { h } from "preact"

import type { RootState } from "../state/State"
import { DesiredStatesList } from "../desired_states/DesiredStatesList"
import { NewDesiredStateForm } from "../desired_states/NewDesiredStateForm"
import { NewStatementForm } from "../statements/NewStatementForm"
import { StatementsList } from "../statements/StatementsList"
import { connect, ConnectedProps } from "react-redux"


const map_state = (state: RootState) => ({
    selected_tab: state.tabs.selected_tab
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _SidePanel (props: Props)
{
    return <div>
        {props.selected_tab === "statements" && <div>
            Add statements:
            <NewStatementForm/>
            <StatementsList/>
        </div>}

        {props.selected_tab === "desired_states" && <div>
            Add desired states:
            <NewDesiredStateForm/>
            <DesiredStatesList/>
        </div>}
    </div>
}


export const SidePanel = connector(_SidePanel)
