import { h } from "preact"
import { useState, useCallback } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"

import type { PatternAttribute } from "../state/State"
import { ACTIONS } from "../state/store"


const map_dispatch = {
    add_pattern: (content: string, attributes: PatternAttribute[]) => ACTIONS.add_pattern({ content, attributes })
}


const connector = connect(null, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _NewPatternForm (props: Props)
{
    const [content, set_content] = useState("")
    const content_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        set_content(event.currentTarget.value)
    }, [content])

    const [attributes, set_attributes] = useState([])
    const attributes_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        // set_attributes(event.currentTarget.value)
    }, [attributes])

    function add_pattern ()
    {
        props.add_pattern(content, attributes)
        set_content("")
        set_attributes([])
    }

    return <div>
        <input
            value={content}
            onChange={content_changed}
            onKeyDown={e => e.key === "Enter" && add_pattern()}
        ></input>
        <input
            type="button"
            onClick={add_pattern}
            value="Add"
        ></input>
    </div>
}


export const NewPatternForm = connector(_NewPatternForm)
