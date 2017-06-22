import * as $ from "jquery";
require("jasmine");

import {ResponsePayload} from "../../../../shared/api";
import {app_store} from "../../../../app/shared/state/store";
import {signin} from "../../../../app/shared/state/user_session/dispatchers";
import {api_normal_user} from "../../../helper/user";
import {get_ajax_stub} from "../../../helper/ajax";
import {clean_up} from "../../../helper/clean_up";
import {reset_store, signin_details} from "../helper";

describe("signin", function () {

    beforeEach(reset_store);

    it("updates user when sign in successful", function (done) {

        const mocked_user = api_normal_user();
        const mocked_success_payload: ResponsePayload.SignInSuccess = {
            status: "SIGNED_IN",
            data: {
                user: mocked_user,
            }
        };
        const ajax_stub = get_ajax_stub({
            trigger_callback: "done",
            args: [mocked_success_payload, "success"],
        });
        spyOn($, "ajax").and.returnValue(ajax_stub);

        signin(signin_details)
        .then((result) => {
            // async done and promises is broken with Jest 18.x,
            // If a test fails it will throw and just cause a time out.
            // So we catch, log the error and then throw so that the test
            // does not pass without error but we see what the error was.
            try {
                let state = app_store.getState().user.user;
                expect(state!).toBe(mocked_user);
            } catch (e) {
                console.error(e);
                throw e;
            }
            done();
        })
        .catch((err) => {
            expect(err).toBe("This should never be reached");
            done();
        });
    });

    afterAll(clean_up);
});
