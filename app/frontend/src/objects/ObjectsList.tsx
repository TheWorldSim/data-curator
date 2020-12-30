import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { ObjectListEntry } from "./ObjectListEntry"
import { ACTIONS } from "../state/store"


interface OwnProps {}


const map_state = (state: RootState) => ({
    objects: state.objects
})


const map_dispatch = {
    object_selected: (item_id: string) => ACTIONS.change_route({ route: "objects", item_id }),
}


const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _ObjectsList (props: Props)
{
    return <table>
        <tbody>
            {props.objects.map(object => <tr>
                <ObjectListEntry object={object} on_click={() => props.object_selected(object.id)} />
            </tr>)}
        </tbody>
    </table>
}


export const ObjectsList = connector(_ObjectsList) as FunctionComponent<OwnProps>
