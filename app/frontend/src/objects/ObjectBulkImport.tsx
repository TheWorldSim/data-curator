import { h } from "preact"
import { useState } from "preact/hooks"


function get_data_from_air_table (set_object_data: (data: string) => void)
{
    const auth_key = localStorage.getItem("airtable_auth_key")
    const app = localStorage.getItem("airtable_app")
    const table = localStorage.getItem("airtable_table")
    const view = localStorage.getItem("airtable_view")
    const url = `https://api.airtable.com/v0/${app}/${table}?maxRecords=100&view=${view}`

    return () =>
    {
        fetch(url, { headers: { "Authorization": `Bearer ${auth_key}` } })
        .then(d => d.json())
        .then(d => {
            /*
            {
                records: [
                    {
                        id: string
                        createdTime: string
                        fields: {
                            Description: string
                            Name: string
                            Projects: string[]
                            Encompasing Action: string[]  // should only be 0 or 1 value
                            Action Type: "Is Spike" | "Is Conditional" | undefined
                            Depends on Actions: string[]  // 0+ values
                            Total time (h): number
                            Status: "Icebox" | "Todo" | "In progress" | "Done" | undefined
                        }
                    }
                ]
            }
            */
        })
    }
}


export function ObjectBulkImport ()
{
    const supported = !!(window.File && window.FileReader && window.FileList && window.Blob)

    const [object_data, set_object_data] = useState("")

    return <div>
        <b>Object Bulk Import</b>

        <br /><br />

        {/* {!supported && <div style={{ color: "red" }}>This feature is not supported by your browser</div>}

        <input
            type="file"
            style={{ backgroundColor: "eef", width: 300, height: 100 }}
            onChange={(e: h.JSX.TargetedEvent<HTMLInputElement, Event>) => {
                const file = e.currentTarget.files && e.currentTarget.files[0]
                if (!file) return
                const fr = new FileReader()
                fr.onload = () => set_object_data(fr.result!.toString())
                fr.readAsText(file)
            }}
        ></input>

        <br /><br />

        {object_data.length} */}

        <hr />

        <b>Get AirTable data</b>

        <br /><br />

        <input type="button" value="Get data" onClick={get_data_from_air_table(set_object_data)}></input>

    </div>
}
