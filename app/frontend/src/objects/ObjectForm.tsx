import { h, FunctionComponent } from "preact"
import { useState, useCallback } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"
import { SelectPattern } from "../patterns/SelectPattern"

import "./Objectform.css"
import { AddObjectProps, convert_from_pattern_attributes, UpdateObjectProps } from "../state/objects"
import type { ObjectAttribute, Objekt, Pattern, PatternAttribute } from "../state/State"
import { ACTIONS } from "../state/store"
import { EditableObjectAttributesList } from "./EditableObjectAttributesList"


type OwnProps = {
    object: Objekt | undefined
}


const map_dispatch = {
    add_object: (args: AddObjectProps) => ACTIONS.add_object(args),
    update_object: (args: UpdateObjectProps) => ACTIONS.update_object(args),
}


const connector = connect(null, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


const blank_state: UpdateObjectProps = {
    id: undefined as unknown as string,
    datetime_created: undefined as unknown as Date,
    pattern_id: "",
    pattern_name: "",
    content: "",

    attributes: [],
    labels: [],
}

function _ObjectForm (props: Props)
{
    const initial_state: UpdateObjectProps = props.object || blank_state
    const [object, set_object] = useState<UpdateObjectProps>(initial_state)
    const [pattern_attributes, set_pattern_attributes] = useState<PatternAttribute[]>([])

    function update_object (args: Partial<UpdateObjectProps>) { set_object({ ...object, ...args }) }

    if (props.object && props.object.id !== object.id) reset_form_data()

    const set_pattern = useCallback((pattern: Pattern) => {
        update_object({
            pattern_id: pattern.id,
            pattern_name: pattern.name,
            content: pattern.content,
            attributes: convert_from_pattern_attributes(pattern.attributes),
        })

        set_pattern_attributes(pattern.attributes)
    }, [object.pattern_id])

    const content_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        set_object({ ...object, content: event.currentTarget.value })
    }, [object.content])


    const change_attributes = useCallback((new_attributes: ObjectAttribute[]) => {
        set_object({ ...object, attributes: new_attributes })
    }, [object.attributes])

    function delete_attribute (index: number)
    {
        const new_attributes = object.attributes.filter((_, i) => i !== index )
        set_object({ ...object, attributes: new_attributes })
    }

    function add_object ()
    {
        props.object ? props.update_object(object) : props.add_object(object)
    }

    function reset_form_data ()
    {
        set_object(initial_state)
        set_pattern_attributes([])
    }

    return <div>
        <b>{props.object ? "Edit" : "Add"} object</b>

        <hr />

        <div>
            <div class="field_label">Pattern:</div>
            <div class="field">
                {<SelectPattern
                    pattern_id={object.pattern_id}
                    disabled={!!props.object}
                    on_change_pattern={set_pattern}
                />}
            </div>
        </div>

        <hr />

        <EditableObjectAttributesList
            pattern_attributes={pattern_attributes}
            attributes={object.attributes}
            change_attributes={change_attributes}
            delete_attribute={delete_attribute}
        />

        <br />

        <input
            type="text"
            placeholder="Object content"
            value={object.content}
            disabled={!!props.object}
            onChange={content_changed}
        ></input>

        <br/><br />

        <input
            type="button"
            onClick={add_object}
            value={(props.object ? "Update" : "Add") + " object"}
            disabled={!object.content}
        ></input>
    </div>
}


export const ObjectForm = connector(_ObjectForm) as FunctionComponent<OwnProps>
