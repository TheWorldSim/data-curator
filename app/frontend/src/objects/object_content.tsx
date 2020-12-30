import type { ObjectAttribute, Objekt, Statement } from "../state/State"
import { config_store } from "../state/store"


interface OwnProps
{
    object: Objekt
    depth?: number
}


let store = config_store()  // mutable for tests


export function object_content ({ object, depth }: OwnProps)
{
    depth = depth === undefined ? 3 : depth
    let content = object.content
    if (!content.startsWith("@@")) return content

    const rendered_content = render_content(content, object.attributes, depth)

    return rendered_content
}


function render_content (content: string, attributes: ObjectAttribute[], depth: number)
{
    if (depth <= 0) return content

    content = content.slice(2)

    const reg_content = /(.*?)c\((?:([\d\.]+)(,[^\)]+)?)\).*?/g

    if (!content.match(reg_content)) return content

    let rendered_content = ""
    --depth

    const iter = content.matchAll(reg_content)
    let match = iter.next()
    while (!match.done)
    {
        rendered_content += match.value[1]
        const attribute_index_lookup = match.value[2]  // 0 or 0.0 etc
        rendered_content += attribute_content(attribute_index_lookup, attributes, depth)

        const new_match = iter.next()
        if (new_match.done)
        {
            const num = match.value[0].length + match.value.index!
            rendered_content += content.slice(num)
        }
        match = new_match
    }

    return rendered_content
}


function attribute_content (attribute_index_lookup: string, attributes: ObjectAttribute[], depth: number)
{
    const { attribute, parts } = get_attribute_from_index_lookup(attribute_index_lookup, attributes)

    return get_content_from_attribute(attribute, parts, depth)
}


function get_attribute_from_index_lookup (attribute_index_lookup: string, attributes: ObjectAttribute[])
{
    const parts = attribute_index_lookup.split(".").map(i => parseInt(i))
    const attribute = attributes[parts[0]]

    return { attribute, parts: parts.slice(1) }
}


function get_content_from_attribute (attribute: ObjectAttribute, parts: number[], depth: number)
{
    if (parts.length)
    {
        if (!attribute.id) return "?"
    }
    else
    {
        if (attribute.value) return attribute.value

        if (!attribute.id) return "?"

        const res = convert_id_to_content(attribute.id)
        if (typeof res === "string") return res
    }

    const res = convert_id_to_content(attribute.id)
    if (typeof res === "string") return res
    const content = parts.length ? `@@c(${parts.join(".")})` : res.content

    return render_content(content, res.attributes, depth)
}


function convert_id_to_content (item_id: string)
{
    const state = store.getState()

    const statement = state.statements.find(({ id }) => id === item_id)

    if (statement) return statement.content

    const object = state.objects.find(({ id }) => id === item_id)

    if (!object) return "?"

    return object
}


// ################################## Tests ##################################


function test <T> (got: T, expected: T)
{
    if (got === expected) console.log("pass")
    else console.error(`fail: ${got} !== ${expected}`)
}


function get_object_for_test (args: Partial<Objekt>)
{
    return {
        id: "o1",
        datetime_created: new Date(),
        content: "abc",
        attributes: [],
        labels: [],
        pattern_id: "p1",
        pattern_name: "p1",
        ...args,
    }
}


function run_tests ()
{
    const inital_state = store.getState()

    const datetime_created = new Date()
    const statement: Statement = { id: "1", datetime_created, content: "stat1", labels: [] }


    const obj1: Objekt = get_object_for_test({ content: "abc" })
    const res1 = object_content({ object: obj1 })
    test(res1, "abc")


    store = config_store(false, { statements: [statement], patterns: [], objects: [] })

    const obj2: Objekt = get_object_for_test({ content: "@@abc(0) c(1)", attributes: [
        { tid: "", value: " val" },
        { tid: "", id: "1" },
    ] })
    const res2 = object_content({ object: obj2 })
    test(res2, "ab val stat1")


    const obj3: Objekt = get_object_for_test({ id: "o3", content: "@@a c(0) c(1)", attributes: [
        { tid: "", value: "val2" },
        { tid: "", id: "1" },
    ] })
    const obj3b: Objekt = get_object_for_test({ content: "@@b c(0)", attributes: [
        { tid: "", id: "o3" },
    ] })
    store = config_store(false, { statements: [statement], patterns: [], objects: [obj3] })
    const res3a = object_content({ object: obj3b })
    test(res3a, "b a val2 stat1")
    const res3b = object_content({ object: obj3b, depth: 1 })
    test(res3b, "b @@a c(0) c(1)")
    const res3c = object_content({ object: obj3b, depth: 0 })
    test(res3c, "@@b c(0)")


    const obj4: Objekt = get_object_for_test({ id: "o4", content: "@@c c(0) c(1)", attributes: [
        { tid: "", value: "val2" },
        { tid: "", id: "1" },
    ] })
    const obj4b: Objekt = get_object_for_test({ id: "o5", content: "@@b c(0)", attributes: [
        { tid: "", id: "o4" },
    ] })
    const obj4c: Objekt = get_object_for_test({ content: "@@a c(0)", attributes: [
        { tid: "", id: "o5" },
    ] })
    store = config_store(false, { statements: [statement], patterns: [], objects: [obj4, obj4b] })
    const res4a = object_content({ object: obj4c, depth: 3 })
    test(res4a, "a b c val2 stat1")


    const obj5a: Objekt = get_object_for_test({ id: "o5", content: "@@sub: c(0)", attributes: [
        { tid: "", value: "o5 val" },
    ] })
    const obj5b: Objekt = get_object_for_test({ content: "@@a c(0.0)", attributes: [
        { tid: "", id: "o5" },
    ] })
    store = config_store(false, { statements: [statement], patterns: [], objects: [obj5a] })
    const res5 = object_content({ object: obj5b })
    test(res5, "a o5 val")


    const obj6: Objekt = get_object_for_test({ id: "o4", content: "@@c c(0) c(1)", attributes: [
        { tid: "", value: "val2" },
        { tid: "", id: "1" },
    ] })
    const obj6b: Objekt = get_object_for_test({ id: "o5", content: "@@part1: c(0.0) part2: c(0.1)", attributes: [
        { tid: "", id: "o4" },
    ] })
    const obj6c: Objekt = get_object_for_test({ content: "@@a c(0)", attributes: [
        { tid: "", id: "o5" },
    ] })
    store = config_store(false, { statements: [statement], patterns: [], objects: [obj6, obj6b] })
    const res6 = object_content({ object: obj6c, depth: 3 })
    test(res6, "a part1: val2 part2: stat1")


    // reset store just in case we run this in production by accident
    store = config_store(false, inital_state)
}

// run_tests()
