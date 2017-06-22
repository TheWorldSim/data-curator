import {User_AdminView, User_OwnerView, USER_VIEW_KINDS} from "../../../shared/models/user";
import {viewable_fields} from "../../../server/models/user/utils";
import {
    server_admin_user,
    server_normal_user,
} from "../../helper/user";
import {clean_up} from "../../helper/clean_up";

describe("user public_fields", () => {

    it("hides fields from public", () => {
        let result = viewable_fields(server_admin_user());
        expect(result.kind).toEqual(USER_VIEW_KINDS.User_PublicView);
        expect((result as User_AdminView).email).toBeUndefined();
        expect((result as User_AdminView).password).toBeUndefined();
    });

    it("hides fields from non admin non owner", () => {
        let result = viewable_fields(server_admin_user(), server_normal_user());
        expect(result.kind).toEqual(USER_VIEW_KINDS.User_PublicView);
        expect((result as User_AdminView).email).toBeUndefined();
        expect((result as User_AdminView).password).toBeUndefined();
    });

    it("shows some fields to owner", () => {
        let result = viewable_fields(server_normal_user(), server_normal_user());
        expect(result.kind).toEqual(USER_VIEW_KINDS.User_OwnerView);
        expect((result as User_OwnerView).email).toEqual("c@d.e");
        expect((result as User_AdminView).admin_notes).toBeUndefined();
    });

    it("shows all fields except password to admin", () => {
        let result = viewable_fields(server_admin_user(), server_admin_user());
        expect(result.kind).toEqual(USER_VIEW_KINDS.User_AdminView);
        expect((result as User_AdminView).admin_notes).toEqual("levelheaded and considerate");
        expect((result as User_AdminView).password).toBeUndefined();

    });

    afterAll(clean_up);
});
