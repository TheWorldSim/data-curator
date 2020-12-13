import reduceReducers = require("reduce-reducers");
import {combineReducers, Reducer} from "redux";
import {routerReducer} from "react-router-redux";

import CONFIG from "../../../shared/config";
import {LOG_LEVELS} from "../../../shared/constants";
import {AppState, AllAppState} from "./shape";
import {Action} from "./actions";
// Reducers
import * as Protected from "./protected/reducer";

type expected_reducers = {
    // tslint:disable-next-line
    [K in keyof AllAppState]: Reducer<any>;
};

const reducers_map: expected_reducers = {
    routing: routerReducer,
    protected: Protected.reducer,
};

const all_reducers_unwrapped = reduceReducers<AppState>(
    // debug logger
    function (state: AppState, action: Action) {
        if (!action.type.match("@@redux-form/") && CONFIG.LOG >= LOG_LEVELS.DEBUG) {
            console.log("REDUCERS: action, state: ", action, state);
        }
        return state;
    },
    // reset reducer for tests
    function (state: AppState, action: Action) {
        if (action.type === "RESET") {
            return {} as AppState;
        }
        return state;
    },
    combineReducers<AppState>(reducers_map)
);

export const all_reducers = function (state: AppState, action: Action) {
    try {
        Object.freeze(state);
        state = all_reducers_unwrapped(state, action);
    } catch (error) {
        console.error("EXCEPTION in reducers:", error);
    }
    return state;
};
