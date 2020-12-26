import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { NewPatternForm } from "../patterns/NewPatternForm"
import { PatternsList } from "../patterns/PatternsList"
import type { RootState } from "../state/State"
import { NewStatementForm } from "../statements/NewStatementForm"
import { StatementsList } from "../statements/StatementsList"


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

        {props.route === "statements" && <div>
            Add statements:
            <NewStatementForm />
            Statements:
            <StatementsList />
        </div>}

        {props.route === "objects" && <div>
            Add Objects:
        </div>}

        {props.route === "patterns" && <div>
            Add patterns:
            <NewPatternForm />
            <hr />
            Patterns:
            <PatternsList />
        </div>}

        {props.route === "creation_context" && <div>
            Set Creation Context:
        </div>}
    </div>
}


export const SidePanel = connector(_SidePanel)
