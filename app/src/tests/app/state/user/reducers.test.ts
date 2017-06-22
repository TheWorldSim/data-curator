import {Action} from "../../../../app/shared/state/actions";
import {reducer} from "../../../../app/shared/state/user/reducer";
import {State} from "../../../../app/shared/state/user/shape";
import {make_helpers} from "../helper";
import {api_normal_user} from "../../../helper/user";
import {clean_up} from "../../../helper/clean_up";

const {
    signin_request,
    signin_success,
    signout_request,
    signout_success,
} = make_helpers(reducer);

describe("reducer", function () {

    it("should init state from undefined", function () {

        const some_other_action: Action = {type: "something-else"};
        let state: State | undefined;
        const result = reducer(state!, some_other_action);

        expect(result).toEqual({});
    });

    it("should init state from empty object", function () {

        const some_other_action: Action = {type: "something-else"};
        const result = reducer({} as State, some_other_action);

        expect(result).toEqual({});
    });

    it("should update state on signin success", function () {

        const result = signin_success({} as State);

        const user = api_normal_user();
        expect(result).toEqual({
            user,
            newly_registered_user_email: undefined,
        });
    });

    it("should update state on logout success", function () {

        let state = signin_request({} as State);
        state = signin_success(state);
        state = signout_request(state);
        let result = signout_success(state);
        expect(result).toEqual({user: undefined});
    });

    afterAll(clean_up);
});
