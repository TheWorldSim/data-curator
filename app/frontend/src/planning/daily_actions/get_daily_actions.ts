import { get_attribute_by_index_lookup, get_attributes_by_index_lookup } from "../../objects/object_content"
import { date2str } from "../../shared/utils/date_helpers"
import type { CoreObjectIdAttribute, CoreObjectValueAttribute, RootState } from "../../state/State"
import { MSECONDS_PER_DAY } from "../display"
import type { DailyAction, DailyActionsMeta } from "../interfaces"


const PATTERN_ACTION_V2 = "p9"
export const get_daily_actions_meta = (state: RootState): DailyActionsMeta => {

    const raw_actions = state.objects.filter(({ pattern_id }) => pattern_id === PATTERN_ACTION_V2)

    const actions_by_project_id: DailyActionsMeta = {}

    raw_actions.forEach(action => {
        const { attributes } = action

        const project_id_attrs = get_attributes_by_index_lookup(1, attributes) as CoreObjectIdAttribute[]
        const start_datetime_attr = get_attribute_by_index_lookup(8, attributes) as CoreObjectValueAttribute
        const stop_datetime_attr = get_attribute_by_index_lookup(9, attributes) as CoreObjectValueAttribute

        project_id_attrs.forEach(({ id }) =>
        {
            actions_by_project_id[id] = actions_by_project_id[id] || {}
        })

        const start_datetime = new Date(start_datetime_attr.value)
        const stop_datetime = new Date(stop_datetime_attr.value)

        if (Number.isNaN(start_datetime.getTime())) return

        const date_strs: string[] = []
        const start_date_str = date2str(start_datetime, "yyyy-MM-dd")
        date_strs.push(start_date_str)

        const stop_ms = stop_datetime.getTime()
        if (!Number.isNaN(stop_ms))
        {
            let date_time = start_datetime.getTime() + MSECONDS_PER_DAY
            while (date_time < stop_ms)
            {
                const date_str = date2str(new Date(date_time), "yyyy-MM-dd")
                date_strs.push(date_str)

                date_time += MSECONDS_PER_DAY
            }
        }

        project_id_attrs.forEach(({ id }) =>
        {
            date_strs.forEach(date_str =>
            {
                actions_by_project_id[id][date_str] = actions_by_project_id[id][date_str] || { action_count: 0 }
                actions_by_project_id[id][date_str].action_count++
            })
        })

    })

    return actions_by_project_id
}
