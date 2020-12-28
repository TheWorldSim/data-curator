import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { StatementListEntry } from "./StatementListEntry"
import { ACTIONS } from "../state/store"
import { DeleteButton } from "../sharedf/DeleteButton"


interface OwnProps {}


const map_state = (state: RootState) => ({
    statements: state.statements
})

const map_dispatch = {
    delete_statement: (id: string) => ACTIONS.delete_statement(id),
    statement_selected: (item_id: string) => ACTIONS.change_route({ route: "statements", item_id }),
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _StatementsList (props: Props)
{

    return <ul style={{ listStyle: "none" }}>
        {props.statements.map(statement => <li>
            <StatementListEntry statement={statement} on_click={() => props.statement_selected(statement.id)}/>
            <DeleteButton delete={() => props.delete_statement(statement.id)}/>
        </li>)}
    </ul>
}


export const StatementsList = connector(_StatementsList) as FunctionComponent<OwnProps>
