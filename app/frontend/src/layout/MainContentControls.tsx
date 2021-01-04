import { h } from "preact"
import { ProjectEvent, TimeSlider } from "../time_control/TimeSlider"


export function MainContentControls ()
{
    const events: ProjectEvent[] = [
        {
            start: new Date("2020-02-18"),
            title: "Launch v0.0.1 of Energy Explorer",
        },
        {
            start: new Date("2020-03-08"),
            title: "Send out first email on pandemic",
        },
        {
            start: new Date("2020-03-09 09:08"),
            title: "Email OpenCell about diagnostics",
        },
        {
            start: new Date("2020-03-09 16:01"),
            title: "Start project ventilators and oxygen",
        },
        {
            start: new Date("2020-03-11"),
            title: "Merge Slack channels to form Helpful Engineering",
        },
        {
            start: new Date("2020-03-17"),
            title: "Talk with Joi Ito about diagnostics IP",
            description: "Start of OpenCovidPledge",
        },
        {
            start: new Date("2020-04-16"),
            title: "Get feedback on draft of OpenCell grant",
        },
        {
            start: new Date("2020-04-24"),
            title: "CCI publishes 2 articles on diagnostics",
        },
        {
            start: new Date("2020-05-06"),
            title: "Draft Continuous Validation idea",
        },
        {
            start: new Date("2020-05-07"),
            title: "Get first feedback on Continuous Validation idea",
        },
        {
            start: new Date("2020-05-15"),
            title: "OpenCell secures fundings for diagnostics R&D",
        },
        {
            start: new Date("2020-05-20"),
            title: "OpenCell CONTAIN paper submitted to biorxiv",
        },
        {
            start: new Date("2020-06-02"),
            title: "First call with IEEE on standardisation",
        },
        {
            start: new Date("2020-06-17"),
            title: "First plan for a project to form a working group on standardisation",
        },
        {
            start: new Date("2020-06-21"),
            title: "Move house",
        },

    ]

    return <div>
        <TimeSlider events={events}/>
    </div>
}
