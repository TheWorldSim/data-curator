
export interface Statement
{
    id: string
    content: string
}


export interface DesiredState
{
    id: string
    content: string
}


export interface State
{
    statements: Statement[]
    desired_states: DesiredState[]
}
