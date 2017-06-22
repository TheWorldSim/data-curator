import {Action} from "../../../../app/shared/state/actions";
import {ERRORS} from "../../../../shared/errors";
import {State, reducer, STATUSES} from "../../../../app/shared/state/user_session/reducer";
import {make_helpers} from "../helper";
import {clean_up} from "../../../helper/clean_up";

const {
    signin_request,
    signin_success,
    signin_failed,
    signout_request,
    signout_success,
    signout_erred,
} = make_helpers(reducer);

describe("reducer", function () {

    it("should init state from undefined", function () {

        const some_other_action: Action = {type: "something-else"};
        let state: State | undefined = undefined;
        const result = reducer(state!, some_other_action);

        const expected = {
            status: STATUSES.SIGNED_OUT,
            last_failed_signin: {},
            last_signout_erred: false,
        };
        expect(result).toEqual(expected);
    });

    it("should init state from empty object", function () {

        const some_other_action: Action = {type: "something-else"};
        const result = reducer({} as State, some_other_action);

        const expected = {
            status: STATUSES.SIGNED_OUT,
            last_failed_signin: {},
            last_signout_erred: false,
        };
        expect(result).toEqual(expected);
    });

    it("should update state on signin request", function () {

        const result = signin_request({} as State);

        expect(result).toEqual({
            status: STATUSES.SIGNING_IN,
            last_failed_signin: {},
            last_signout_erred: false,
        });
    });

    it("should update state on signin success", function () {

        let state = signin_request({} as State);
        const result = signin_success(state);

        expect(result).toEqual({
            status: STATUSES.SIGNED_IN,
            last_failed_signin: {},
            last_signout_erred: false,
        });
    });

    it("should update state on logout request", function () {

        let state = signin_request({} as State);
        state = signin_success(state);
        const result = signout_request(state);

        expect(result).toEqual({
            status: STATUSES.SIGNING_OUT,
            last_failed_signin: {},
            last_signout_erred: false,
        });
    });

    it("should update state on logout success", function () {

        let state = signin_request({} as State);
        state = signin_success(state);
        state = signout_request(state);
        const result = signout_success(state);

        expect(result).toEqual({
            status: STATUSES.SIGNED_OUT,
            last_failed_signin: {},
            last_signout_erred: false,
        });
    });

    it("should update state on logout failure", function () {

        let state = signin_request({} as State);
        state = signin_success(state);
        state = signout_request(state);
        const result = signout_erred(state);

        expect(result).toEqual({
            status: STATUSES.SIGNED_OUT,
            last_failed_signin: {},
            last_signout_erred: true,
        });
    });

    it("should update state on signin request after a logout", function () {

        let state = signin_request({} as State);
        state = signin_success(state);
        state = signout_request(state);
        state = signout_success(state);
        const result = signin_request(state);

        expect(result).toEqual({
            status: STATUSES.SIGNING_IN,
            last_failed_signin: {},
            last_signout_erred: false,
        });
    });

    it("should update state on signin failure", function () {

        let state = signin_request({} as State);
        const result = signin_failed(state);

        expect(result).toEqual({
            status: STATUSES.SIGNED_OUT,
            last_failed_signin: {
                status_text: ERRORS.EMAIL_OR_PASSWORD_NOT_RECOGNISED,
                status_code: 401,
            },
            last_signout_erred: false,
        });
    });

    it("should update state on signin request after failure", function () {

        let state = signin_request({} as State);
        state = signin_failed(state);
        const result = signin_request(state);

        expect(result).toEqual({
            status: STATUSES.SIGNING_IN,
            last_failed_signin: {
                status_text: ERRORS.EMAIL_OR_PASSWORD_NOT_RECOGNISED,
                status_code: 401,
            },
            last_signout_erred: false,
        });
    });

    afterAll(clean_up);
});
