import { FunctionComponent, h } from "preact"
import { useState, useCallback } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"

import { ACTIONS } from "../state/store"


interface OwnProps {}


const map_dispatch = {
    add_statement: (content: string) => ACTIONS.add_statement({ content })
}


const connector = connect(null, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _NewStatementForm (props: Props)
{
    const [value, set_value] = useState("")
    const value_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        set_value(event.currentTarget.value)
    }, [value])

    function add_statement ()
    {
        props.add_statement(value)
        set_value("")
    }

    return <div>
        <input
            value={value}
            onChange={value_changed}
            onKeyDown={e => e.key === "Enter" && add_statement()}
        ></input>
        <input
            type="button"
            onClick={add_statement}
            value="Add"
        ></input>
    </div>
}


export const NewStatementForm = connector(_NewStatementForm) as FunctionComponent<OwnProps>
