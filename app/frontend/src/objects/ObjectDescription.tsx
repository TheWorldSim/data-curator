import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { LabelsList } from "../labels/LabelsList"
import type { Objekt, RootState } from "../state/State"
import { object_content } from "./object_content"


interface OwnProps {
    object: Objekt
}


function map_state (state: RootState, props: OwnProps)
{
    return {
        pattern: state.patterns.find(({ id }) => id === props.object.pattern_id)
    }
}


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps


function _ObjectDescription (props: Props)
{
    const pattern_name = props.pattern?.name || "?"

    return <div>
        {pattern_name}: {object_content({ object: props.object })}
        <div style={{ display: "inline-block"}}>
            <LabelsList labels={props.object.labels} />
        </div>
    </div>
}


export const ObjectDescription = connector(_ObjectDescription) as FunctionalComponent<OwnProps>
