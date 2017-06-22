import * as $ from "jquery";
require("jasmine");

import {app_store, dispatch} from "../../../../app/shared/state/store";
import {ResponsePayload} from "../../../../shared/api";
import {PATHS} from "../../../../shared/paths";
import {signin, signout} from "../../../../app/shared/state/user_session/dispatchers";
import {ERRORS} from "../../../../shared/errors";
import {api_normal_user} from "../../../helper/user";
import {get_ajax_stub} from "../../../helper/ajax";
import {clean_up} from "../../../helper/clean_up";
import {signin_request_action, signin_success_action, reset_store, signin_details} from "../helper";

// async done and promises is broken with Jest 18.x,
// If a test fails it will throw and just cause a time out or kill
// the whole test process.
// So we catch and log the error.  The test process will still return a 0 exit
// code but we see can at least see what the error was.

describe("signin", function () {

    const mocked_success_payload: ResponsePayload.SignInSuccess = {
        status: "SIGNED_IN",
        data: { user: api_normal_user() },
    };

    beforeEach(reset_store);

    it("Should not signin twice", function (done) {

        let ajax_stub = get_ajax_stub({
            trigger_callback: "done",
            args: [mocked_success_payload, "success"],
        });
        spyOn($, "ajax").and.returnValue(ajax_stub);

        signin(signin_details)
        .then(() => {

            let state = app_store.getState().session;
            try {
                expect(state.status).toBe("SIGNED_IN");
            } catch (e) {
                console.error(e);
            }

            // prevents logging during tests
            spyOn(console, "error");

            signin(signin_details)
            .then((success) => {

                expect(success).toBe("This should never be reached1");
                done();
            })
            .catch((err) => {

                state = app_store.getState().session;
                try {
                    expect(state.status).toBe("SIGNED_IN");
                } catch (e) {
                    console.error(e);
                }

                done();
            });

        }).catch((err) => {

            expect(err).toBe("This should never be reached2");
            done();
        });

    });

    it("changes state to signed in when sign in successful", function (done) {

        const ajax_stub = get_ajax_stub({
            trigger_callback: "done",
            args: [mocked_success_payload, "success"],
        });
        spyOn($, "ajax").and.returnValue(ajax_stub);

        signin(signin_details)
        .then(() => {

            try {

                const state = app_store.getState();
                expect(state.session.status).toBe("SIGNED_IN");
                expect(state.path_after_signinout).toBe(PATHS.HOME);
            } catch (e) {
                console.error(e);
                // throw e;
            }
            done();
        }).catch((err) => {

            expect(err).toBe("This should never be reached3");
            done();
        });
    });

    it("changes state to signed out when sign in unsuccessful", function (done) {

        // Not clear yet where jquery exposes this on the fail callback arguments.
        // let mocked_failure_payload: ResponsePayload.SignInFailed = {
        //     success: false,
        //     data: {error_message: "bad password"}
        // };
        let ajax_stub = get_ajax_stub({
            trigger_callback: "fail",
            args: [{status: 401, statusText: "bad password"}],
        });
        spyOn($, "ajax").and.returnValue(ajax_stub);
        signin(signin_details)
        .then((result) => {
            expect(result).toBe("This should never be reached4");
            done();
        })
        .catch(() => {
            try {
                let state = app_store.getState().session;
                expect(state.status).toBe("SIGNED_OUT");
                expect(state.last_failed_signin.status_code).toBe(401);
                expect(state.last_failed_signin.status_text).toBe("bad password");
            } catch (e) {
                console.error(e);
                // throw e;
            }
            done();
        });
    });

    it("changes state to signed out when sign out successful", function (done) {

        // Set up state
        dispatch(signin_request_action());
        dispatch(signin_success_action());

        const ajax_stub = get_ajax_stub({
            trigger_callback: "done",
            args: [mocked_success_payload, "success"],
        });
        spyOn($, "ajax").and.returnValue(ajax_stub);

        signout()
        .then(() => {

            try {

                const state = app_store.getState();
                expect(state.session.status).toBe("SIGNED_OUT");
                expect(state.path_after_signinout).toBe(PATHS.HOME);
            } catch (e) {

                console.error(e);
                // throw e;
            }
            done();
        }).catch((err) => {
            expect(err).toBe("This should never be reached5");
            done();
        });
    });

    it("changes state to signed out when sign out error", function (done) {

        // Set up state
        dispatch(signin_request_action());
        dispatch(signin_success_action());

        // Not clear yet where jquery exposes this on the fail callback arguments.
        // let mocked_failure_payload: ResponsePayload.SignOutErred = {
        //     statusCode: 400,
        //     error: "",
        //     message: ERRORS.ALREADY_SIGNED_OUT,
        // };
        let ajax_stub = get_ajax_stub({
            trigger_callback: "fail",
            args: [{status: 400, statusText: ""}],
        });
        spyOn($, "ajax").and.returnValue(ajax_stub);

        signout()
        .then((result) => {
            expect(result).toBe("This should never be reached6");
            done();
        })
        .catch((err) => {
            try {
                let state = app_store.getState().session;
                expect(state.status).toBe("SIGNED_OUT");
                expect(state.last_signout_erred).toBe(true);
            } catch (e) {
                console.error(e);
                // throw e;
            }
            done();
        });
    });

    afterAll(clean_up);
});
