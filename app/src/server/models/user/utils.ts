import {UserDbFields} from "./db";
import {
    User_AdminView,
    User_OwnerView,
    User_PublicView,
    User_Views,
    USER_VIEW_KINDS,
} from "../../../shared/models/user";

export interface AuthedUser {
    uuid: string;
    is_admin: boolean;
}

/**
 * Only fields that the user / admin should be allowed to view
 */
export function viewable_fields(user: UserDbFields, authed_user?: AuthedUser): User_Views {

    if (authed_user && authed_user.is_admin) {
        let u: User_AdminView = {
            kind: "User_AdminView",
            uuid: user.uuid,
            created_at: user.created_at,
            modified_at: user.modified_at,
            deleted_at: user.deleted_at,

            email: user.email,
            is_admin: user.is_admin,
            admin_notes: user.admin_notes,
            added_by_admin_uuid: user.added_by_admin_uuid,
        };
        return u;
    }
    else if (authed_user && authed_user.uuid === user.uuid) {
        return owner_view(user);
    }
    else {
        let u: User_PublicView = {
            kind: USER_VIEW_KINDS.User_PublicView,
            uuid: user.uuid,
            created_at: user.created_at,
            modified_at: user.modified_at,
            deleted_at: user.deleted_at,
        };
        return u;
    }
}

export function owner_view(user: UserDbFields): User_OwnerView {
    return {
        kind: USER_VIEW_KINDS.User_OwnerView,
        uuid: user.uuid,
        created_at: user.created_at,
        modified_at: user.modified_at,
        deleted_at: user.deleted_at,

        email: user.email,
        is_admin: user.is_admin,
    };
}
