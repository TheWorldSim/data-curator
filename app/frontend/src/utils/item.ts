import { is_statement, Statement, Pattern } from "../state/State"


export function description (item: Statement | Pattern)
{
    if (is_statement(item)) return item.content
    return item.name
}
