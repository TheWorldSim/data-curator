
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


export type TAB_TYPES = "statements" | "desired_states"
export interface TabsState
{
    selected_tab: TAB_TYPES
}


export interface RootState
{
    statements: Statement[]
    desired_states: DesiredState[]
    tabs: TabsState
}
