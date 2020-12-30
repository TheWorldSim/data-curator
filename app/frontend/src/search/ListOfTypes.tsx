import { Component, FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { PatternListEntry } from "../patterns/PatternListEntry"
import { StatementListEntry } from "../statements/StatementListEntry"
import type { Item, Pattern, RootState } from "../state/State"
import { CORE_IDS } from "../state/core_data"


export type ITEM_FILTERS = "simple_types" | "types" | "patterns"


interface OwnProps
{
    filter_type: ITEM_FILTERS
    filtered_by_string: string
    on_click: (item: Item) => void
}


function map_state (state: RootState, own_props: OwnProps)
{
    const { filtered_by_string, filter_type } = own_props
    const fi = filtered_by_string.toLowerCase()

    let statements = state.statements
        .filter(s => s.labels.includes(CORE_IDS.Type))
        .filter(s => s.id.startsWith(fi) || s.content.toLowerCase().includes(fi))
    let patterns: Pattern[] = []

    if (filter_type === "types" || filter_type === "patterns")
    {
        patterns = state.patterns.filter(p => {
            return p.id.startsWith(fi) || p.name.toLowerCase().includes(fi) || p.content.toLowerCase().includes(fi)
        })
    }

    if (filter_type === "patterns") statements = []

    return {
        // TODO memoize
        statements,
        patterns,
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
        return <table>
            <tbody>
                {this.props.statements.map(s => <tr key={s.id}>
                    <StatementListEntry statement={s} on_click={() => this.props.on_click(s)} />
                </tr>)}
                {this.props.patterns.map(p => <tr key={p.id}>
                    <PatternListEntry pattern={p} on_click={() => this.props.on_click(p)} />
                </tr>)}
            </tbody>
        </table>
    }
}


export const ListOfTypes = connector(_ListOfTypes) as FunctionComponent<OwnProps>
