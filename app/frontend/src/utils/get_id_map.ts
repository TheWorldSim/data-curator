import type { RootState, Item } from "../state/State"


const statement_id_regex = new RegExp(/^\d/)
const id_is_statement = (id: string) => statement_id_regex.test(id)

const pattern_id_regex = new RegExp(/^p/)
const id_is_pattern = (id: string) => pattern_id_regex.test(id)

const object_id_regex = new RegExp(/^o/)
const id_is_object = (id: string) => object_id_regex.test(id)


export function get_id_map (ids: string[], state: RootState)
{
    const id_map: {[id: string]: Item} = {}

    ids.forEach(id_to_find =>
    {
        let item: Item | undefined
        if (id_is_statement(id_to_find))
        {
            item = state.statements.find(({ id }) => id === id_to_find)
        }

        if (id_is_pattern(id_to_find))
        {
            item = state.patterns.find(({ id }) => id === id_to_find)
        }

        if (id_is_object(id_to_find))
        {
            item = state.objects.find(({ id }) => id === id_to_find)
        }

        if (item) id_map[id_to_find] = item
    })

    return id_map
}
