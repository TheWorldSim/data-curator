import * as _ from "lodash";
import * as $ from "jquery";

import CONFIG from "../../../shared/config";
import {dispatch} from "./store";

type FetchArgs<ResponseData> = {
    path: string;
    success_action: string | ((response_data: ResponseData, text_status: string) => void);
    failure_action: string;
} & ({
    method: "POST";
    data: {} | undefined;
} | {
    method: "GET";
    data?: undefined;
});

export function fetch<ResponseData>(args: FetchArgs<ResponseData>): Promise<{}> {

    const {path, data, method, success_action, failure_action} = args;

    return new Promise((resolve, reject) => {

        $.ajax({
            url: CONFIG.SERVER_URI + path,
            data: JSON.stringify(data),
            contentType : "application/json",
            method,
            crossDomain: true,
            xhrFields: {
                withCredentials: true,
            },
        })
        .then(function (response_data, text_status) {

            if (_.isString(success_action)) {
                const action = {
                    type: success_action,
                    response: response_data,
                };
                dispatch(action);
            }
            else {
                success_action(response_data, text_status);
            }
            _.defer(resolve);

        }, function (xhr, textStatus) {

            const action = {
                type: failure_action,
                status_code: xhr.status,
                status_text: xhr.statusText,
                response: JSON.parse(xhr.responseText || "{\"error\":\"no xhr.responseText\"}"),
            };
            dispatch(action);
            _.defer(reject);
        });
    });
}
