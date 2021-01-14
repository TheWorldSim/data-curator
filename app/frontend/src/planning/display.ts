
const SCALE = 10

export const MSECONDS_PER_DAY = 86400000
const scale_days = SCALE / MSECONDS_PER_DAY

export const x_factory = (origin_ms: number) => (start_datetime_ms: number) => (start_datetime_ms - origin_ms) * scale_days

export const calc_width = (start_datetime_ms: number, stop_datetime_ms: number) => {
    const w = stop_datetime_ms - start_datetime_ms
    return w * scale_days
}

const y_factory = (offset: number) => (vertical_position: number) => (offset * SCALE) + (vertical_position * 11 * SCALE)
export const project_priority_y = y_factory(0)
export const project_priority_height = 7 * SCALE

export const action_y = y_factory(8)
export const action_height = 1 * SCALE
