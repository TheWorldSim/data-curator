import { h } from "preact"

import type { RootState } from "../state/State"
import { NewStatementForm } from "../statements/NewStatementForm"
import { StatementsList } from "../statements/StatementsList"
import { connect, ConnectedProps } from "react-redux"


const map_state = (state: RootState) => ({
    route: state.routing.route
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _SidePanel (props: Props)
{
    return <div>
        {props.route === "statements" && <div>
            Add statements:
            <NewStatementForm/>
            <StatementsList/>
        </div>}
    </div>
}


export const SidePanel = connector(_SidePanel)
