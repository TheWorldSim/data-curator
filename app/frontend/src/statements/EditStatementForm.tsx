import { h } from "preact"

import type { Statement } from "../state/State"


type Props = {
    statement: Statement
}


export function EditStatementForm (props: Props)
{

    return <div>
        <input
            type="text"
            placeholder="Statement"
            value={props.statement.content}
            // onChange={content_changed}
            disabled={true}
        ></input>
    </div>
}
