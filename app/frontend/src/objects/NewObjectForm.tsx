import { h, FunctionComponent } from "preact"
import { useState, useCallback } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"

import type { ObjectAttribute } from "../state/State"
import { ACTIONS } from "../state/store"
import { EditableObjectAttributesList } from "./EditableObjectAttributesList"


interface OwnProps {}


const map_dispatch = {
    // add_object: (args: { name: string, content: string, attributes: ObjectAttribute[] }) => ACTIONS.add_object(args)
}


const connector = connect(null, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _NewObjectForm (props: Props)
{
    const [name, set_name] = useState("")
    const name_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        set_name(event.currentTarget.value)
    }, [name])

    const [content, set_content] = useState("")
    const content_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        set_content(event.currentTarget.value)
    }, [content])

    const [attributes, set_attributes] = useState<ObjectAttribute[]>([])

    const change_attributes = useCallback((new_attributes: ObjectAttribute[]) => {
        set_attributes(new_attributes)
    }, [attributes])

    function delete_attribute (index: number)
    {
        const new_attributes = attributes.filter((_, i) => i !== index )
        set_attributes(new_attributes)
    }

    function add_object ()
    {
        // props.add_object({ name, content, attributes })
        set_content("")
        set_attributes([])
    }

    return <div>
        <input
            type="text"
            placeholder="Object name"
            value={name}
            onChange={name_changed}
        ></input>

        <br /><br />

        <EditableObjectAttributesList
            attributes={attributes}
            change_attributes={change_attributes}
            delete_attribute={delete_attribute}
        />

        <br />

        <input
            type="text"
            placeholder="Object content"
            value={content}
            onChange={content_changed}
        ></input>

        <br/><br />

        <input
            type="button"
            onClick={add_object}
            value="Add object"
            disabled={!name}
        ></input>
    </div>
}


export const NewObjectForm = connector(_NewObjectForm) as FunctionComponent<OwnProps>
