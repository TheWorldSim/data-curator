import {createStore, applyMiddleware, compose} from "redux";
const History = require("history");
import {routerMiddleware as create_redux_router_middleware} from "react-router-redux";

import CONFIG from "../../../shared/config";
import {all_reducers} from "./reducers";
import {AppState} from "./shape";
import {Action} from "./actions";

// tslint:disable-next-line
// https://github.com/ReactTraining/react-router/tree/dc2149ec0c63bfc95b71e40c81431e34cfbfeda9/packages/react-router-redux
export const history = History.createBrowserHistory();
const redux_router_middleware = create_redux_router_middleware(history);
const redux_router_store_enhancer = applyMiddleware(redux_router_middleware);

// tslint:disable-next-line
const glo = (window || global) as any;
// From: https://github.com/zalmoxisus/redux-devtools-extension#1-with-redux
let compose_enhancers = compose;

if (CONFIG.ENV_DEVELOPMENT && glo.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    compose_enhancers = glo.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    });
}

export const app_store = createStore<AppState>(
    all_reducers,
    compose_enhancers(redux_router_store_enhancer)
);
// Alternatively could use
// const create_store_with_middleware = redux_router_store_enhancer<AppState>(createStore);
// export const app_store = create_store_with_middleware(enableBatching(all_reducers));

export function dispatch(action: Action): Action {
    return app_store.dispatch(action);
}

/**
 * For debugging store / dispatchers / actions / state.
 * Uncomment console.log line to see changes to store.
 */
let old_state: AppState;
app_store.subscribe(() => {
    let new_state = app_store.getState();
    // console.log("STORE CHANGED: old state:", old_state, " new state: ", new_state);
    old_state = new_state;
});

if (process.env.NODE_ENV === "development") {
    (window as any).app_store = app_store;  // tslint:disable-line
}
