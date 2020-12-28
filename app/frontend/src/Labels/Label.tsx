import { h } from "preact"

import "./Label.css"
import type { Statement } from "../state/State"


interface Props
{
    statement: Statement
    is_small: boolean
}

export function Label (props: Props)
{
    return <div className={"label " + (props.is_small ? "small" : "")}>
        {props.statement.content}
    </div>
}
