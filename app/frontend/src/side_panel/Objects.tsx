import { FunctionComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import type { RootState } from "../state/State"
import { ObjectsList } from "../objects/ObjectsList"
import { ObjectForm } from "../objects/ObjectForm"
import { ObjectBulkImport } from "../objects/ObjectBulkImport"


interface OwnProps {}


const map_state = (state: RootState) => ({
    object: state.objects.find(({ id }) => id === state.routing.item_id),
    show_bulk_import: state.routing.sub_route === "objects_bulk_import",
})

const connector = connect(map_state)
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & OwnProps


function _Objects (props: Props)
{
    if (props.show_bulk_import)
    {
        return <div>
            <ObjectBulkImport />
        </div>
    }


    return <div>
        <ObjectForm object={props.object}/>
        <hr />
        Objects:
        <ObjectsList />
    </div>
}


export const Objects = connector(_Objects) as FunctionComponent<OwnProps>
