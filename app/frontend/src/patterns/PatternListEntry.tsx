import { h } from "preact"

import type { Pattern } from "../state/State"


interface Props {
    pattern: Pattern
}


export function PatternListEntry (props: Props)
{
    return <div>{props.pattern.name}</div>
}
