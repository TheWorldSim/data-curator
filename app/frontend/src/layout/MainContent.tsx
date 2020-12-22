import { h } from "preact"

import type { RootState } from "../state/State"
import { connect, ConnectedProps } from "react-redux"
import { Canvas } from "../canvas/Canvas"


const map_state = (state: RootState) => ({
    route: state.routing.route
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {}


function _MainContent (props: Props)
{
    return <div>
        <Canvas />
    </div>
}


export const MainContent = connector(_MainContent)
