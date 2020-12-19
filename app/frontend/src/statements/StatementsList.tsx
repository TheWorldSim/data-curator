import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { StatementListEntry } from "./StatementListEntry"
import { ACTIONS } from "../state/store"
import { DeleteButton } from "../sharedf/DeleteButton"


const map_state = (state: RootState) => ({
    statements: state.statements
})

const map_dispatch = {
    delete_statement: (id: string) => ACTIONS.delete_statement(id)
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _StatementsList (props: Props)
{

    return <ul>
        {props.statements.map(statement => <li>
            <StatementListEntry statement={statement}/>
            <DeleteButton delete={() => props.delete_statement(statement.id)}/>
        </li>)}
    </ul>
}


export const StatementsList = connector(_StatementsList)
