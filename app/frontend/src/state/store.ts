import { createStore, Action, Reducer, AnyAction } from "redux"


export interface RootState
{
    counter: number
    counter_last_clicked: Date | null
}

function default_state (): RootState
{
    return { counter: 0, counter_last_clicked: null }
}


const root_reducer: Reducer<RootState, any> = (state: RootState | undefined, action: AnyAction) =>
{
    state = state || default_state()

    if (is_increment_clicked(action))
    {
        state = {
            ...state,
            counter: state.counter + 1,
            counter_last_clicked: action.when
        }
    }

    return state
}


export function config_store ()
{
    return createStore<RootState, Action, any, any>(root_reducer)
}


interface ActionIncrementClicked extends Action { when: Date }
const increment_clicked_type = "increment_clicked"
const increment_clicked = (when: Date): ActionIncrementClicked => ({ type: increment_clicked_type, when })
const is_increment_clicked = (action: AnyAction): action is ActionIncrementClicked => {
    return action.type === increment_clicked_type
}

export const ACTIONS =
{
    increment_clicked,
}
