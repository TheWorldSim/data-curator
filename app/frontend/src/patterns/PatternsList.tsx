import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { PatternListEntry } from "./PatternListEntry"
import { ACTIONS } from "../state/store"
import { DeleteButton } from "../sharedf/DeleteButton"


const map_state = (state: RootState) => ({
    patterns: state.patterns
})

const map_dispatch = {
    delete_pattern: (id: string) => ACTIONS.delete_pattern(id),
    pattern_selected: (item_id: string) => ACTIONS.change_route({ route: "patterns", item_id }),
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _PatternsList (props: Props)
{

    return <ul style={{ listStyle: "none" }}>
        {props.patterns.map(pattern => <li>
            <PatternListEntry pattern={pattern} on_click={() => props.pattern_selected(pattern.id)} />
            <DeleteButton delete={() => props.delete_pattern(pattern.id)}/>
        </li>)}
    </ul>
}


export const PatternsList = connector(_PatternsList)
