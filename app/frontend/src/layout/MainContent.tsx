import { h } from "preact"

import { DesiredStatesList } from "../desired_states/DesiredStatesList"
import { NewDesiredStateForm } from "../desired_states/NewDesiredStateForm"
import { NewStatementForm } from "../statements/NewStatementForm"
import { StatementsList } from "../statements/StatementsList"


export function MainContent ()
{
    return <div>
        Add statements:
        <NewStatementForm/>
        <StatementsList/>

        Add desired state:
        <NewDesiredStateForm/>
        <DesiredStatesList/>
    </div>
}
