import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";

require("./main.css");
import {app_store} from "../../state/store";
import {ConnectedSessionSpecificRoutes as SessionSpecificRoutes} from "./session_specific_routes";

/**
 * @param additional_routes  Currently unused but when once ejected from
 *      create-react-app, the app can be made to have 3 entry points which each
 *      will call this with their specific routes
 * @param html_container_element  specify the html_container_element for testing
 */
export function render_app (html_container_element?: HTMLElement) {

    html_container_element = html_container_element || document.getElementById("content")!;

    ReactDOM.render(
        <Provider store={app_store}>
            <SessionSpecificRoutes />
        </Provider>,
        html_container_element
    );
}
