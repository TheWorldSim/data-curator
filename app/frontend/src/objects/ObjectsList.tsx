import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { ObjectListEntry } from "./ObjectListEntry"


interface OwnProps {}


const map_state = (state: RootState) => ({
    objects: state.objects
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _ObjectsList (props: Props)
{
    return <table>
        <tbody>
            {props.objects.map(object => <tr>
                <ObjectListEntry object={object} />
            </tr>)}
        </tbody>
    </table>
}


export const ObjectsList = connector(_ObjectsList) as FunctionComponent<OwnProps>
