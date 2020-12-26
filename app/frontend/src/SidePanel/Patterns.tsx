import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { EditPatternForm } from "../patterns/EditPatternForm"
import { PatternsList } from "../patterns/PatternsList"
import { NewPatternForm } from "../patterns/NewPatternForm"


const map_state = (state: RootState) => ({
    pattern: state.patterns.find(({ id }) => id === state.routing.item_id)
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _Patterns (props: Props)
{
    if (props.pattern)
    {
        return <div>
            <EditPatternForm pattern={props.pattern} />
        </div>
    }

    return <div>
        Add patterns:
        <NewPatternForm />
        <hr />
        Patterns:
        <PatternsList />
    </div>
}

export const Patterns = connector(_Patterns)
