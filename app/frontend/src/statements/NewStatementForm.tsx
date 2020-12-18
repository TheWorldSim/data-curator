import { h } from "preact"
import { useState, useCallback } from "preact/hooks"


interface NewStatementFormProps {
    create_statement: (value: string) => void
}

export function NewStatementForm (props: NewStatementFormProps)
{
    const [value, setValue] = useState("")
    const value_changed = useCallback((event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
        setValue(event.currentTarget.value)
    }, [value])

    function create_statement ()
    {
        props.create_statement(value)
        setValue("")
    }

    return <div>
        Form
        <input
            value={value}
            onChange={value_changed}
            onKeyDown={e => e.key === "Enter" && create_statement()}
        ></input>
        <input
            type="button"
            onClick={create_statement}
            value="Add"
        ></input>
    </div>
}
