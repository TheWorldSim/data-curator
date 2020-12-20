import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { DesiredStateListEntry } from "./DesiredStateListEntry"
import { ACTIONS } from "../state/store"
import { DeleteButton } from "../sharedf/DeleteButton"


const map_state = (state: RootState) => ({
    desired_states: state.desired_states
})

const map_dispatch = {
    delete_desired_state: (id: string) => ACTIONS.delete_desired_state(id)
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _DesiredStatesList (props: Props)
{

    return <ul style={{ listStyle: "none" }}>
        {props.desired_states.map(desired_state => <li>
            <DesiredStateListEntry desired_state={desired_state}/>
            <DeleteButton delete={() => props.delete_desired_state(desired_state.id)}/>
        </li>)}
    </ul>
}


export const DesiredStatesList = connector(_DesiredStatesList)
