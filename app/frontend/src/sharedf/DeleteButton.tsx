import { h } from "preact"


interface DeleteButtonProps
{
    delete: () => void
}


export function DeleteButton (props: DeleteButtonProps)
{
    return <input type="button" value="X" onClick={() => props.delete()}></input>
}
