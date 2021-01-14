
export interface NodeField
{
    name: string
    value: string
}

interface NodeProps
{
    x: number
    y: number
    width: number
    height: number

    display: boolean
}

interface TextNodeProps extends NodeProps
{
    title: string
    fields: NodeField[]
}


export interface ProjectPriorityNodeProps extends TextNodeProps
{
    effort: number
}

export interface DailyActionNodeProps extends NodeProps {
    action_count: number
}
