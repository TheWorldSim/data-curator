
export function replace_element<T> (elements: T[], replacement: T, predicate: (element: T) => boolean): T[]
{
    const index = elements.findIndex(predicate)

    if (index < 0)
    {
        console.error(`Can not find element by predicate: ${predicate.toString()}`)
        return elements
    }

    return [...elements.slice(0, index), replacement, ...elements.slice(index + 1)]
}
