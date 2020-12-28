import { FunctionalComponent, h } from "preact"
import type { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"
import { DeleteButton } from "../sharedf/DeleteButton"

import type { Pattern } from "../state/State"
import { ACTIONS } from "../state/store"
import { PatternAttributesList } from "./PatternAttributesList"


interface OwnProps
{
    pattern: Pattern
}


const map_dispatch = (dispatch: Dispatch, props: OwnProps) =>
{
    return {
        delete_pattern: () => dispatch(ACTIONS.delete_pattern(props.pattern.id))
    }
}

const connector = connect(null, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps


function _EditPatternForm (props: Props)
{

    return <div>
        <input
            type="text"
            placeholder="Pattern name"
            value={props.pattern.name}
            // onChange={name_changed}
            disabled={true}
        ></input>

        <PatternAttributesList
            attributes={props.pattern.attributes}
            // change_attributes={change_attributes}
            // delete_attribute={delete_attribute}
        />

        <br />

        <input
            type="text"
            placeholder="Pattern content"
            value={props.pattern.content}
            // onChange={content_changed}
            disabled={true}
        ></input>

        <hr/>

        <DeleteButton on_delete={() => props.delete_pattern()} is_large={true}/>

        {/* <input
            type="button"
            value="Add pattern"
            // onClick={add_pattern}
            disabled={true}
        ></input> */}
    </div>
}


export const EditPatternForm = connector(_EditPatternForm) as FunctionalComponent<OwnProps>
