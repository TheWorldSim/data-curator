import { h } from "preact"
import { useState, useCallback } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"

import type { Pattern, PatternAttribute } from "../state/State"
import { ACTIONS } from "../state/store"
import { PatternAttributesList } from "./PatternAttributesList"


// const map_dispatch = {}


// const connector = connect(null, map_dispatch)
// type PropsFromRedux = ConnectedProps<typeof connector>

type Props = { //PropsFromRedux & {
    pattern: Pattern
}


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

        <input
            type="text"
            placeholder="Pattern content"
            value={props.pattern.content}
            // onChange={content_changed}
            disabled={true}
        ></input>

        <br/>

        {/* <input
            type="button"
            value="Add pattern"
            // onClick={add_pattern}
            disabled={true}
        ></input> */}
    </div>
}


export const EditPatternForm = _EditPatternForm // connector(_EditPatternForm)
