
export interface NodeField
{
    name: string
    value: string
}

export interface GraphNode
{
    title: string
    fields: NodeField[]

    x: number
    y: number
    width: number
    height: number

    display: boolean
}
