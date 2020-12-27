import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { EditStatementForm } from "../statements/EditStatementForm"
import { StatementsList } from "../statements/StatementsList"
import { NewStatementForm } from "../statements/NewStatementForm"


const map_state = (state: RootState) => ({
    statement: state.statements.find(({ id }) => id === state.routing.item_id)
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _Statements (props: Props)
{
    if (props.statement)
    {
        return <div>
            <EditStatementForm statement={props.statement} />
        </div>
    }

    return <div>
        Add statements:
        <NewStatementForm />
        <hr />
        Statements:
        <StatementsList />
    </div>
}

export const Statements = connector(_Statements)
