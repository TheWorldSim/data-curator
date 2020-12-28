import { h } from "preact"
import { LabelsList } from "../Labels/LabelsList"
import { is_statement, Statement, Pattern } from "../state/State"


export function description (item: Statement | Pattern)
{
    if (is_statement(item)) {
        return <div>
            {item.content}
            <div style={{ display: "inline-block"}}>
                <LabelsList labels={item.labels} />
            </div>
        </div>
    }
    return item.name
}
