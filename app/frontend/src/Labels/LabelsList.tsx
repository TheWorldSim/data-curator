import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState, Statement } from "../state/State"
import { Label } from "./Label"


interface OwnProps
{
    labels: string[]  // statement_id[]
}


function map_state (state: RootState, { labels }: OwnProps)
{
    const statement_ids = new Set(labels)

    return {
        statements: state.statements.filter(({ id }) => statement_ids.has(id))
    }
}


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps


function _LabelsList (props: Props)
{
    return <div>
        {props.statements.map(s => <Label statement={s} is_small={true} />)}
    </div>
}


export const LabelsList = connector(_LabelsList) as FunctionalComponent<OwnProps>
