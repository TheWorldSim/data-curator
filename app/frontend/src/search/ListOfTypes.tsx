import { Component, FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { PatternListEntry } from "../patterns/PatternListEntry"
import { StatementListEntry } from "../statements/StatementListEntry"
import type { RootState } from "../state/State"


interface OwnProps
{
    filtered_by: string
    on_click: (id: string) => void
}


function map_state (state: RootState, own_props: OwnProps)
{
    const fi = own_props.filtered_by

    return {
        // TODO memoize
        statements: state.statements.filter(s => s.id.startsWith(fi) || s.content.toLowerCase().includes(fi)),
        patterns: state.patterns.filter(p => p.id.startsWith(fi) || p.name.toLowerCase().includes(fi) || p.content.toLowerCase().includes(fi)),
    }
}


const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


interface State
{
}

class _ListOfTypes extends Component<Props, State>
{
    constructor(props: Props) {
        super(props)

        this.state = {
        }
    }

    render ()
    {
        return <div>
            <ul>
                {this.props.statements.map(s => <li key={s.id}>
                    <StatementListEntry statement={s} on_click={() => this.props.on_click(s.id)} />
                </li>)}
                {this.props.patterns.map(p => <li key={p.id}>
                    <PatternListEntry pattern={p} on_click={() => this.props.on_click(p.id)} />
                </li>)}
            </ul>
        </div>
    }
}


export const ListOfTypes = connector(_ListOfTypes) as FunctionComponent<OwnProps>
