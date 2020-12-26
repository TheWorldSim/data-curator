import { h } from "preact"
import { useState, useCallback } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"

import type { PatternAttribute } from "../state/State"
import { ACTIONS } from "../state/store"
import { EditablePatternAttributesList } from "./EditablePatternAttributesList"


const map_dispatch = {
    add_pattern: (args: { name: string, content: string, attributes: PatternAttribute[] }) => ACTIONS.add_pattern(args)
}


const connector = connect(null, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _NewPatternForm (props: Props)
{
    const [name, set_name] = useState("")
    const name_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        set_name(event.currentTarget.value)
    }, [name])

    const [content, set_content] = useState("")
    const content_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        set_content(event.currentTarget.value)
    }, [content])

    const [attributes, set_attributes] = useState<PatternAttribute[]>([])

    const change_attributes = useCallback((new_attributes: PatternAttribute[]) => {
        set_attributes(new_attributes)
    }, [attributes])

    function delete_attribute (index: number)
    {
        const new_attributes = attributes.filter((_, i) => i !== index )
        set_attributes(new_attributes)
    }

    function add_pattern ()
    {
        props.add_pattern({ name, content, attributes })
        set_content("")
        set_attributes([])
    }

    return <div>
        <input
            type="text"
            placeholder="Pattern name"
            value={name}
            onChange={name_changed}
        ></input>

        <EditablePatternAttributesList
            attributes={attributes}
            change_attributes={change_attributes}
            delete_attribute={delete_attribute}
        />

        <input
            type="text"
            placeholder="Pattern content"
            value={content}
            onChange={content_changed}
        ></input>

        <br/>

        <input
            type="button"
            onClick={add_pattern}
            value="Add pattern"
        ></input>
    </div>
}


export const NewPatternForm = connector(_NewPatternForm)
