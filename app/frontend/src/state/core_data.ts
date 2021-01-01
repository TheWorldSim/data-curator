
let statement_id = 0
export const sid = () => "s" + (statement_id++).toString()
let pattern_id = 0
const pid = () => "p" + (pattern_id++).toString()
let object_id = 0
export const oid = () => "o" + (object_id++).toString()


export const STATEMENT_IDS = {
    Type: sid(),
    Title: sid(),
    DOI: sid(),
    URL: sid(),
    Year: sid(),
    "Month of year": sid(),
    "Day of month": sid(),
    "Hour of day": sid(),
    "Minute of hour": sid(),
    "Seconds of minute": sid(),
    "Nanoseconds": sid(),
    "Timezone": sid(),
    "Action status": sid(),
}


export const PATTERN_IDS = {
    Person: pid(),
    // Persons: pid(),
    Group: pid(),
    "Person(s) or Group(s)": pid(),
    Datetime: pid(),
    "Date": pid(),
    Document: pid(),
    Project: pid(),
    Action: pid(),
    "Reference statement": pid(),
}


const pattern_handles = new Set(Object.keys(PATTERN_IDS))
const conflicts = Object.keys(STATEMENT_IDS).filter(k => pattern_handles.has(k))
if (conflicts.length) throw new Error(`${conflicts.length} conflicting handles: ${conflicts.join(", ")}`)


export const CORE_IDS = {
    ...STATEMENT_IDS,
    ...PATTERN_IDS,
}
