import { RootState, Item, Objekt, is_id_attribute, CoreObjectIdAttribute } from "../state/State"


const statement_id_regex = new RegExp(/^\d/)
const id_is_statement = (id: string) => statement_id_regex.test(id)

const pattern_id_regex = new RegExp(/^p/)
const id_is_pattern = (id: string) => pattern_id_regex.test(id)

const object_id_regex = new RegExp(/^o/)
const id_is_object = (id: string) => object_id_regex.test(id)


export type ID_ITEM_MAP = {[id: string]: Item}

export function get_id_map (ids: string[], state: RootState, depth: number = 1): ID_ITEM_MAP
{
    let id_map: ID_ITEM_MAP = {}

    if (depth <= 0) return id_map

    const objects: Objekt[] = []
    ids.forEach(id_to_find =>
    {
        let item: Item | undefined
        if (id_is_object(id_to_find))
        {
            item = state.objects.find(({ id }) => id === id_to_find)
            if (item) objects.push(item as Objekt)
        }

        else if (id_is_statement(id_to_find))
        {
            item = state.statements.find(({ id }) => id === id_to_find)
        }

        else if (id_is_pattern(id_to_find))
        {
            item = state.patterns.find(({ id }) => id === id_to_find)
        }

        if (item) id_map[id_to_find] = item
    })

    const next_ids: string[] = get_ids_from_objects_attributes(objects)
    const deeper_id_map = get_id_map(next_ids, state, depth - 1)

    return {
        ...id_map,
        ...deeper_id_map,
    }
}


function get_ids_from_objects_attributes (objects: Objekt[])
{
    let all_ids: string[] = []
    objects.map(get_ids_from_object_attributes)
        .forEach(ids => all_ids = [...all_ids, ...ids])
    return all_ids
}


export function get_ids_from_object_attributes (object: Objekt)
{
    const id_attributes = object.attributes.filter(is_id_attribute) as CoreObjectIdAttribute[]
    const ids: string[] = id_attributes.map(({ id }) => id)
    return ids
}
