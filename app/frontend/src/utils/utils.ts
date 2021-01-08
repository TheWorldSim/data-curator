

export function get_datetime ()
{
    return new Date()
}


function get_new_id ()
{
    return (parseInt(Math.random().toString().slice(2)) + 100000).toString()
}
export const get_new_statement_id = () => "s" + get_new_id()
export const get_new_pattern_id = () => "p" + get_new_id()
export const get_new_object_id = () => "o" + get_new_id()


const statement_id_regex = new RegExp(/^s\d/)
export const id_is_statement = (id: string | undefined | null) => !!id && statement_id_regex.test(id)

const pattern_id_regex = new RegExp(/^p\d/)
export const id_is_pattern = (id: string | undefined | null) => !!id && pattern_id_regex.test(id)

const object_id_regex = new RegExp(/^o\d/)
export const id_is_object = (id: string | undefined | null) => !!id && object_id_regex.test(id)

export const id_is_valid = (id: string | undefined | null) =>
{
    return id_is_statement(id) || id_is_pattern(id) || id_is_object(id)
}

export function bounded (num: number, min: number, max: number): number
{
    return Math.max(Math.min(num, max), min)
}
