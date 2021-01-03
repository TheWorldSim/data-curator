import { Component, FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { PatternListEntry } from "../patterns/PatternListEntry"
import { StatementListEntry } from "../statements/StatementListEntry"
import type { Item, RootState } from "../state/State"
import { CORE_IDS } from "../state/core_data"
import { ObjectListEntry } from "../objects/ObjectListEntry"


export type ITEM_FILTERS = "simple_types" | "types" | "patterns" | "all_concrete"


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
    let patterns = state.patterns
    let objects = state.objects

    if (filter_type === "simple_types" || filter_type === "types")
    {
        statements = statements
            .filter(s => s.labels.includes(CORE_IDS.sType))
    }
    else if (filter_type === "patterns")
    {
        statements = []
    }

    statements = statements.filter(s => s.id.startsWith(fi) || s.content.toLowerCase().includes(fi))


    if (filter_type === "types" || filter_type === "patterns")
    {
        patterns = patterns.filter(p => {
            return p.id.startsWith(fi) || p.name.toLowerCase().includes(fi) || p.content.toLowerCase().includes(fi)
        })
    }
    else
    {
        patterns = []
    }


    if (filter_type !== "all_concrete")
    {
        objects = []
    }

    objects = objects.filter(o => o.id.startsWith(fi) || o.content.toLowerCase().includes(fi) || o.rendered.toLowerCase().includes(fi))

    return {
        // TODO memoize
        statements,
        patterns,
        objects,
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
                    { StatementListEntry({ statement: s, on_click: () => this.props.on_click(s) }) }
                </tr>)}
                {this.props.patterns.map(p => <tr key={p.id}>
                    { PatternListEntry({ pattern: p, on_click: () => this.props.on_click(p) }) }
                </tr>)}
                {this.props.objects.map(o => <tr key={o.id}>
                    { ObjectListEntry({ object: o, on_click: () => this.props.on_click(o) }) }
                </tr>)}
            </tbody>
        </table>
    }
}


export const ListOfTypes = connector(_ListOfTypes) as FunctionComponent<OwnProps>
