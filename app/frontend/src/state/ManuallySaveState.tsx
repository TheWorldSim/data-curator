import { h } from "preact"
import { useState } from "preact/hooks"
import type { State } from "./State"


function move_stored_state (id: number)
{
    const state_str = localStorage.getItem(`saved_state_${id}`) || "n/a"
    localStorage.setItem(`saved_state_${id + 1}`, state_str)
}

interface ManuallySaveStateProps
{
    state: State
}

export function ManuallySaveState (props: ManuallySaveStateProps)
{
    const [just_saved, set_just_saved] = useState(false)

    function save_state ()
    {
        move_stored_state(3)
        move_stored_state(2)
        move_stored_state(1)
        localStorage.setItem("saved_state_1", JSON.stringify(props.state))
        set_just_saved(true)

        setTimeout(() => set_just_saved(false), 500)
    }

    const style = {
        backgroundColor: just_saved ? "green" : ""
    }

    const text = just_saved ? "Saved" : "(Backup) Save"

    return <div>
        <input type="button" onClick={save_state} style={style} value={text}></input>
    </div>
}
