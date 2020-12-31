import { FunctionalComponent, h } from "preact"
import type { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { DeleteButton } from "../sharedf/DeleteButton"

import type { ObjectWithCache } from "../state/State"
import { ObjectAttributesList } from "./ObjectAttributesList"
import { object_content } from "./object_content"
import { SelectPattern } from "../patterns/SelectPattern"


interface OwnProps
{
    object: ObjectWithCache
}


const map_dispatch = (dispatch: Dispatch, props: OwnProps) =>
{
    return {
        // delete_object: () => dispatch(ACTIONS.delete_object(props.object.id))
    }
}

const connector = connect(null, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


function _EditObjectForm (props: Props)
{

    return <div>
        <SelectPattern
            pattern_id={props.object.pattern_id}
            disabled={true}
        />

        <hr />

        <div>
            { object_content({ object: props.object }) }
        </div>

        <br />

        <input
            type="text"
            placeholder="Object content"
            value={props.object.content}
            // onChange={content_changed}
            disabled={true}
        ></input>

        <hr/>

        <ObjectAttributesList
            attributes={props.object.attributes}
            // change_attributes={change_attributes}
            // delete_attribute={delete_attribute}
        />

        <hr/>

        <DeleteButton on_delete={() => undefined /*props.delete_object()*/ } is_large={true}/>

        {/* <input
            type="button"
            value="Add object"
            // onClick={add_object}
            disabled={true}
        ></input> */}
    </div>
}


export const EditObjectForm = connector(_EditObjectForm) as FunctionalComponent<OwnProps>
