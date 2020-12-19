import { h } from "preact"
import { connect, ConnectedProps } from "react-redux"
import { ACTIONS, RootState } from "./state/store"


const mapState = (state: RootState) => ({
    count: state.counter,
    date: state.counter_last_clicked
})


const mapDispatch = {
    increment: () => ACTIONS.increment_clicked(new Date())
}


const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    backgroundColor: string
}

function _DemoCounter (props: Props)
{
    const clicked_at = props.date ? `Clicked at ${props.date.getSeconds()} seconds` : ""

    return <div style={{ backgroundColor: props.backgroundColor }}>
        <input type="button" value="Increment counter" onClick={props.increment}></input>
        {clicked_at} counter: {props.count}
    </div>
}

export const DemoCounter = connector(_DemoCounter)
