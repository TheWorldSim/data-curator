import { h } from "preact"

import "./DeleteButton.css"


interface OwnProps
{
    on_delete: () => void
    is_large?: boolean
    disabled?: boolean
}


export function DeleteButton (props: OwnProps)
{
    let value = "X"
    if (props.is_large) value = "Delete"

    return <input
        type="button"
        value={value}
        onClick={() => props.on_delete()}
        className={(props.is_large ? "large" : "") + (props.disabled ? " disabled" : "") }
        disabled={props.disabled}
    ></input>
}
