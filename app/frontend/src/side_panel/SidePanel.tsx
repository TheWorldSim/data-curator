import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"
import { ACTIONS } from "../state/actions"

import type { RootState } from "../state/State"
import { Objects } from "./Objects"
import { Patterns } from "./Patterns"
import { Statements } from "./Statements"


interface OwnProps {}


const map_state = (state: RootState) => ({
    route: state.routing.route
})

const map_dispatch = {
    change_view: (view: string) => ACTIONS.change_route({
        route: undefined,
        sub_route: undefined,
        item_id: undefined,
        args: { view },
    })
}

const connector = connect(map_state, map_dispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _SidePanel (props: Props)
{
    const views: { view: string, name: string }[] = [
        { view: "planning", name: "Planning" },
        { view: "knowledge", name: "Knowledge" },
    ]

    return <div>
        {props.route === "filter" && <div>
            Filter
        </div>}

        {props.route === "statements" && <Statements />}

        {props.route === "objects" && <Objects />}

        {props.route === "patterns" && <Patterns />}

        {props.route === "creation_context" && <div>
            Set Creation Context:
        </div>}

        {props.route === "views" && <div>
            <b>Views</b>

            <br />
            <br />

            {views.map(({ view, name }) => [<input
                    type="button"
                    value={name}
                    onClick={() => props.change_view(view)}
                ></input>, <br/>]
            )}
        </div>}
    </div>
}


export const SidePanel = connector(_SidePanel) as FunctionComponent<OwnProps>
