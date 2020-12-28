import { FunctionComponent, h } from "preact"

import type { RootState } from "../state/State"
import { connect, ConnectedProps } from "react-redux"
import { Canvas } from "../canvas/Canvas"


interface OwnProps {}


const map_state = (state: RootState) => ({
    route: state.routing.route
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _MainContent (props: Props)
{
    return <div>
        <Canvas />
    </div>
}


export const MainContent = connector(_MainContent) as FunctionComponent<OwnProps>
