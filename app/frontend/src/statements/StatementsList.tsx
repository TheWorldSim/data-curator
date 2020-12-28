import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { ACTIONS } from "../state/store"
import { StatementListEntry } from "./StatementListEntry"


interface OwnProps {}


const map_state = (state: RootState) => ({
    statements: state.statements
})

const map_dispatch = {
    statement_selected: (item_id: string) => ACTIONS.change_route({ route: "statements", item_id }),
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _StatementsList (props: Props)
{

    return <table>
        <tbody>
            {props.statements.map(statement => <tr>
                <StatementListEntry statement={statement} on_click={() => props.statement_selected(statement.id)}/>
            </tr>)}
        </tbody>
    </table>
}


export const StatementsList = connector(_StatementsList) as FunctionComponent<OwnProps>
