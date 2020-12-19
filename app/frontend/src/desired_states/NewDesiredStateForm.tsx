import { h } from "preact"
import { useState, useCallback } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"

import { ACTIONS } from "../state/store"


const map_dispatch = {
    add_desired_state: (content: string) => ACTIONS.add_desired_state({ content })
}


const connector = connect(null, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _NewDesiredStateForm (props: Props)
{
    const [value, set_value] = useState("")
    const value_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        set_value(event.currentTarget.value)
    }, [value])

    function add_desired_state ()
    {
        props.add_desired_state(value)
        set_value("")
    }

    return <div>
        <input
            value={value}
            onChange={value_changed}
            onKeyDown={e => e.key === "Enter" && add_desired_state()}
        ></input>
        <input
            type="button"
            onClick={add_desired_state}
            value="Add"
        ></input>
    </div>
}


export const NewDesiredStateForm = connector(_NewDesiredStateForm)
