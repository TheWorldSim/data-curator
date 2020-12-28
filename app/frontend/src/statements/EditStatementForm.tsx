import { h } from "preact"

import { LabelsList } from "../Labels/LabelsList"
import type { Statement } from "../state/State"


type Props = {
    statement: Statement
}


export function EditStatementForm (props: Props)
{
    const labels = props.statement.labels

    return <div>
        <input
            type="text"
            placeholder="Statement"
            value={props.statement.content}
            // onChange={content_changed}
            disabled={true}
        ></input>

        <br/>
        <br/>

        Labels:
        <LabelsList labels={labels} />
    </div>
}
