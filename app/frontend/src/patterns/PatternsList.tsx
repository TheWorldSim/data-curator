import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { PatternListEntry } from "./PatternListEntry"
import { ACTIONS } from "../state/store"


interface OwnProps {}


const map_state = (state: RootState) => ({
    patterns: state.patterns
})


const map_dispatch = {
    pattern_selected: (item_id: string) => ACTIONS.change_route({ route: "patterns", item_id }),
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _PatternsList (props: Props)
{

    return <table>
        <tbody>
            {props.patterns.map(pattern => <tr>
                <PatternListEntry pattern={pattern} on_click={() => props.pattern_selected(pattern.id)} />
            </tr>)}
        </tbody>
    </table>
}


export const PatternsList = connector(_PatternsList) as FunctionComponent<OwnProps>
