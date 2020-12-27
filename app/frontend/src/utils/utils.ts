

export function get_datetime ()
{
    return new Date()
}


export function get_new_id ()
{
    return Math.random().toString().slice(2)
}


export function bounded (num: number, min: number, max: number): number
{
    return Math.max(Math.min(num, max), min)
}
