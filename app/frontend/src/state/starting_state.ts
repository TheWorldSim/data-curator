import { CORE_IDS, STATEMENT_IDS } from "./core_data"
import { get_current_route_params } from "./routing/routing"
import { datetime_to_routing_args } from "./routing/routing_datetime"
import type { ObjectWithCache, Pattern, RootState, RoutingArgs, Statement } from "./State"


export function get_starting_state (): RootState
{
    const datetime_created = new Date("2020-12-22")
    const dt2 = new Date("2020-12-31")

    const statements: Statement[] = Object.keys(STATEMENT_IDS).map(handle => ({
        id: (STATEMENT_IDS as any)[handle],
        content: handle.slice(1),
        datetime_created,
        labels: [CORE_IDS.sType],  // All are given label of type
    }))


    const patterns: Pattern[] = [
        {
            id: CORE_IDS.pPerson,
            datetime_created,
            name: "Person",
            content: "@@c(0) c(1)",
            attributes: [
                { type_id: "", alt_name: "First name" },
                { type_id: "", alt_name: "Last name" },
            ]
        },
        {
            id: CORE_IDS.pGroup,
            datetime_created,
            name: "Group",
            content: "@@c(0)",
            attributes: [
                { type_id: "", alt_name: "Group" },
                // TO DO: add more fields like URL, physical address etc
            ]
        },
        {
            id: CORE_IDS["pPerson(s) or Group(s)"],
            datetime_created,
            name: "Person(s) or Group(s)",
            content: "@@cm(0), cm(1)",
            attributes: [
                { type_id: CORE_IDS["pPerson"], alt_name: "Person(s)", multiple: true },
                { type_id: CORE_IDS["pGroup"], alt_name: "Group(s)", multiple: true },
            ]
        },
        {
            id: CORE_IDS.pDatetime,
            datetime_created,
            name: "Date time",
            content: "@@c(0)-c(1)-c(2) c(3):c(4):c(5) UTC",
            attributes: [
                { type_id: CORE_IDS.sYear, alt_name: "" },
                { type_id: CORE_IDS["sMonth of year"], alt_name: "" },
                { type_id: CORE_IDS["sDay of month"], alt_name: "" },
                { type_id: CORE_IDS["sHour of day"], alt_name: "" },
                { type_id: CORE_IDS["sMinute of hour"], alt_name: "" },
                { type_id: CORE_IDS["sSeconds of minute"], alt_name: "" },
            ]
        },
        {
            id: CORE_IDS.pDate,
            datetime_created,
            name: "Date",
            content: "@@c(0.0)-c(0.1)-c(0.2)",
            attributes: [
                { type_id: CORE_IDS.pDatetime, alt_name: "" },
            ]
        },
        {
            id: CORE_IDS.pDocument,
            datetime_created,
            name: "Document",
            content: "@@c(0) - c(1), c(2)",
            attributes: [
                { type_id: "", alt_name: "Title" },
                { type_id: CORE_IDS["pPerson(s) or Group(s)"], alt_name: "Author(s)" },
                { type_id: CORE_IDS.pDate, alt_name: "Published date" },
                { type_id: CORE_IDS.sURL, alt_name: "" },
                { type_id: CORE_IDS.sDOI, alt_name: "" },
            ]
        },
        {
            id: CORE_IDS.pProject,
            datetime_created: dt2,
            name: "Project",
            content: "@@Project: c(0) - c(4)",
            attributes: [
                { type_id: "", alt_name: "What is it" },
                { type_id: "", alt_name: "Who cares? (impact)" },
                { type_id: CORE_IDS.pActionV1, alt_name: "What are the next step(s)", multiple: true },
                { type_id: CORE_IDS["pPerson(s) or Group(s)"], alt_name: "Allies", multiple: true },
                { type_id: "", alt_name: "Status" },
                { type_id: "", alt_name: "Why are we rejecting it for now" },
                { type_id: "", alt_name: "Why we might return to it" },
            ]
        },
        {
            id: CORE_IDS.pActionV1,
            datetime_created: dt2,
            name: "Action v1",
            content: "@@c(0)",
            attributes: [
                { type_id: "", alt_name: "Name" },
                { type_id: CORE_IDS.pProject, alt_name: "Project(s)", multiple: true },
                { type_id: "", alt_name: "Description" },
                { type_id: CORE_IDS["sAction status"], alt_name: "Status" },
                { type_id: CORE_IDS.pActionV1, alt_name: "Encompassing Action" },
                { type_id: CORE_IDS.pActionV1, alt_name: "Depends on Actions", multiple: true },
            ]
        },
        {
            id: CORE_IDS["pReference statement"],
            datetime_created: dt2,
            name: "Referenced statement",
            content: "@@Ref: c(1.1) - c(0)",
            attributes: [
                { type_id: "", alt_name: "Content" },
                { type_id: CORE_IDS.pDocument, alt_name: "" },
                { type_id: CORE_IDS.sURL, alt_name: "Subdocument" },
            ]
        },
    ]

    const objects: ObjectWithCache[] = []


    const routing_args: RoutingArgs = {
        ...datetime_to_routing_args(new Date()),
        view: "planning",
        zoom: "100",
        x: "0",
        y: "0",
    }

    const starting_state: RootState = {
        statements,
        patterns,
        objects,
        sync: { ready: false, status: "LOADING" },
        routing: { route: "statements", sub_route: null, item_id: null, args: routing_args },
        global_key_press: { last_key: undefined, last_key_time_stamp: undefined },
        current_datetime: { dt: new Date() }
    }

    starting_state.routing = get_current_route_params(starting_state)

    return starting_state
}
