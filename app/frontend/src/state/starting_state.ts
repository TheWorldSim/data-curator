import { CORE_IDS, oid, sid, STATEMENT_IDS } from "./core_data"
import { merge_pattern } from "./objects"
import { get_current_route_params } from "./routing"
import type { CoreObject, Pattern, RootState, Statement } from "./State"


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
                { type_id: CORE_IDS.pAction, alt_name: "What are the next step(s)", multiple: true },
                { type_id: CORE_IDS["pPerson(s) or Group(s)"], alt_name: "Allies", multiple: true },
                { type_id: "", alt_name: "Status" },
                { type_id: "", alt_name: "Why are we rejecting it for now" },
                { type_id: "", alt_name: "Why we might return to it" },
            ]
        },
        {
            id: CORE_IDS.pAction,
            datetime_created: dt2,
            name: "Action",
            content: "@@c(0)",
            attributes: [
                { type_id: "", alt_name: "Name" },
                { type_id: CORE_IDS.pProject, alt_name: "Project(s)", multiple: true },
                { type_id: "", alt_name: "Description" },
                { type_id: CORE_IDS["sAction status"], alt_name: "Status" },
                { type_id: CORE_IDS.pAction, alt_name: "Encompasing Action" },
                { type_id: CORE_IDS.pAction, alt_name: "Depends on Actions", multiple: true },
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

    const years = Array.from(Array(130)).map((_, i) => 1900 + i)
    const OTHER_IDS = {
        title_covid_who: sid(),
        // Not yet convinced "year" is the level of granularity to model.
        ...years.reduce((accum: {[year: string]: string}, i) => {
            accum[`year_${i}`] = sid()
            return accum
        }, {}),
        url_who_covid: sid(),
        status_action_icebox: sid(),
        status_action_todo: sid(),
        status_action_in_progress: sid(),
        status_action_done: sid(),

        group_who: oid(),
        date_2020_10_15: oid(),
        date_2020_10_15_short: oid(),
        document_who_covid: oid(),
        document_who_covid_video: oid(),
        refstat_who_measles_95_herd: oid(),
    }

    statements.push({
        id: OTHER_IDS.title_covid_who,
        datetime_created,
        content: "Coronavirus disease (COVID-19): Herd immunity, lockdowns and COVID-19",
        labels: [],
    })
    years.forEach(i => statements.push({
        id: (OTHER_IDS as any)[`year_${i}`],
        datetime_created,
        content: `${i}`,
        labels: [CORE_IDS.sYear],
    }))
    statements.push({
        id: OTHER_IDS.url_who_covid,
        datetime_created,
        content: "https://www.who.int/news-room/q-a-detail/herd-immunity-lockdowns-and-covid-19",
        labels: [CORE_IDS.sURL],
    })

    // Action status
    statements.push({
        id: OTHER_IDS.status_action_icebox,
        datetime_created: dt2,
        content: "Icebox",
        labels: [CORE_IDS["sAction status"]],
    })
    statements.push({
        id: OTHER_IDS.status_action_todo,
        datetime_created: dt2,
        content: "Todo",
        labels: [CORE_IDS["sAction status"]],
    })
    statements.push({
        id: OTHER_IDS.status_action_in_progress,
        datetime_created: dt2,
        content: "In progress",
        labels: [CORE_IDS["sAction status"]],
    })
    statements.push({
        id: OTHER_IDS.status_action_done,
        datetime_created: dt2,
        content: "Done",
        labels: [CORE_IDS["sAction status"]],
    })


    const core_objects: CoreObject[] = [
        {
            id: OTHER_IDS.group_who,
            datetime_created,
            pattern_id: CORE_IDS.pGroup,
            attributes: [
                { pidx: 0, value: "WHO" }
            ],
            labels: [],
            external_ids: {},
        },
        {
            id: OTHER_IDS.date_2020_10_15,
            datetime_created,
            pattern_id: CORE_IDS.pDatetime,
            attributes: [
                { pidx: 0, id: (OTHER_IDS as any).year_2020 },
                { pidx: 1, value: "10" },
                { pidx: 2, value: "15" },
                { pidx: 3, value: "" },
                { pidx: 4, value: "" },
                { pidx: 5, value: "" },
            ],
            labels: [],
            external_ids: {},
        },
        {
            id: OTHER_IDS.date_2020_10_15_short,
            datetime_created,
            pattern_id: CORE_IDS.pDate,
            attributes: [
                { pidx: 0, id: OTHER_IDS.date_2020_10_15 },
            ],
            labels: [],
            external_ids: {},
        },
        {
            id: OTHER_IDS.document_who_covid,
            datetime_created,
            pattern_id: CORE_IDS.pDocument,
            attributes: [
                { pidx: 0, id: OTHER_IDS.title_covid_who },
                { pidx: 1, id: OTHER_IDS.group_who },
                { pidx: 2, id: OTHER_IDS.date_2020_10_15_short },
                { pidx: 3, id: OTHER_IDS.url_who_covid },
                { pidx: 4, id: "" },
            ],
            labels: [],
            external_ids: {},
        },
        {
            id: OTHER_IDS.document_who_covid_video,
            datetime_created: dt2,
            pattern_id: CORE_IDS.pDocument,
            attributes: [
                { pidx: 0, value: "WHO's Science in 5 on COVID-19 - Herd Immunity" },
                { pidx: 1, id: OTHER_IDS.group_who },
                { pidx: 2, value: "2020-08-28" },
                { pidx: 3, value: "https://youtu.be/U47SaDAmyrE" },
                { pidx: 4, id: "" },
            ],
            labels: [OTHER_IDS.document_who_covid],
            external_ids: {},
        },
        {
            id: OTHER_IDS.refstat_who_measles_95_herd,
            datetime_created: dt2,
            pattern_id: CORE_IDS["pReference statement"],
            attributes: [
                { pidx: 0, value: "To achieve herd immunity in the population, for measles, you need about 95% of the people to have immunity or antibodies" },
                { pidx: 1, id: OTHER_IDS.document_who_covid_video },
                { pidx: 2, value: "https://youtu.be/U47SaDAmyrE?t=56" },
            ],
            labels: [OTHER_IDS.document_who_covid],
            external_ids: {},
        },
    ]
    const objects = core_objects.map(o => merge_pattern(o, patterns))
        .map(object => ({
            ...object,
            rendered: "",
            needs_rendering: true,
        }))


    const starting_state: RootState = {
        statements,
        patterns,
        objects,
        routing: get_current_route_params({ statements, patterns, objects }),
        global_key_press: { last_key: undefined, last_key_time_stamp: undefined },
    }

    return starting_state
}
