import { h } from "preact"

import "./DeleteButton.css"


interface OwnProps
{
    delete: () => void
    is_large?: boolean
}


export function DeleteButton (props: OwnProps)
{
    let value = "X"
    if (props.is_large) value = "Delete"

    return <input
        type="button"
        value={value}
        onClick={() => props.delete()}
        className={props.is_large ? "large" : ""}
    ></input>
}
