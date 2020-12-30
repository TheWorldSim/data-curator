import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { ObjectsList } from "../objects/ObjectsList"
import { ObjectForm } from "../objects/ObjectForm"


interface OwnProps {}


const map_state = (state: RootState) => ({
    object: state.objects.find(({ id }) => id === state.routing.item_id)
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _Objects (props: Props)
{
    // if (props.object)
    // {
    //     return <div>
    //         <ObjectForm object={props.object} />
    //     </div>
    // }

    return <div>
        <ObjectForm object={props.object}/>
        <hr />
        Objects:
        <ObjectsList />
    </div>
}


export const Objects = connector(_Objects) as FunctionComponent<OwnProps>
