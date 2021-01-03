import { Component, FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import "./ListOfTypes.css"
import { PatternListEntry } from "../patterns/PatternListEntry"
import { StatementListEntry } from "../statements/StatementListEntry"
import type { Item, ObjectWithCache, Pattern, RootState, Statement } from "../state/State"
import { CORE_IDS } from "../state/core_data"
import { ObjectListEntry } from "../objects/ObjectListEntry"
import { id_is_object, id_is_pattern, id_is_statement } from "../utils/utils"


export type ITEM_FILTERS = "simple_types" | "types" | "patterns" | "all_concrete"


interface OwnProps
{
    specific_type_id?: string
    filter_type: ITEM_FILTERS
    filtered_by_string: string
    on_click: (item: Item) => void
}


interface SearchProps
{
    search: {
        weight: number
        match: boolean
    }
}


function add_search_props (item: Statement): Statement & SearchProps
function add_search_props (item: Pattern): Pattern & SearchProps
function add_search_props (item: ObjectWithCache): ObjectWithCache & SearchProps
function add_search_props (item: Item): Item & SearchProps
{
    return {
        ...item,
        search: {
            weight: 0,
            match: true,
        }
    }
}


function map_state (state: RootState, own_props: OwnProps)
{
    const { filtered_by_string, filter_type } = own_props
    const fi = filtered_by_string.toLowerCase()

    let statements: (Statement & SearchProps)[] = state.statements.map(i => add_search_props(i))
    let patterns: (Pattern & SearchProps)[] = state.patterns.map(i => add_search_props(i))
    let objects: (ObjectWithCache & SearchProps)[] = state.objects.map(add_search_props) as (ObjectWithCache & SearchProps)[]

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

    let items: (Item & SearchProps)[] = []

    items = items
        .concat(statements)
        .concat(patterns)
        .concat(objects)

    items = items
        .map(i => {
            if (!own_props.specific_type_id) return i

            if (i.hasOwnProperty("labels"))
            {
                const t = i as (Statement | ObjectWithCache)
                const match = t.labels.includes(own_props.specific_type_id)

                if (match)
                {
                    i.search.weight += 1
                }

                i.search.match = match
            }

            return i
        })

    items = items
        .sort(({ search: { weight: a } }, { search: { weight: b } }) => a === b ? 0 : (a > b ? -1 : 1))

    return {
        // TODO memoize
        items,
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
                {this.props.items.map(item => <tr key={item.id} className={item.search.match ? "match" : ""}>
                    { id_is_statement(item.id) && StatementListEntry({
                        statement: item as Statement,
                        on_click: () => this.props.on_click(item)
                    }) }

                    { id_is_pattern(item.id) && PatternListEntry({
                        pattern: item as Pattern,
                        on_click: () => this.props.on_click(item)
                    }) }

                    { id_is_object(item.id) && ObjectListEntry({
                        object: item as ObjectWithCache,
                        on_click: () => this.props.on_click(item)
                    }) }
                </tr>)}
            </tbody>
        </table>
    }
}


export const ListOfTypes = connector(_ListOfTypes) as FunctionComponent<OwnProps>
