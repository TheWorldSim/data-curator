
export interface Statement
{
    id: string
    content: string
    datetime_created: Date
}


export interface DesiredState
{
    id: string
    content: string
    datetime_created: Date
}


export interface RootState
{
    statements: Statement[]
    desired_states: DesiredState[]
}
