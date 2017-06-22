import {str_enum} from "@ajp/utils-ts/utils";

import {
    BaseModel,
    from_pojo as base_from_pojo,
} from "./base";
import {BaseDbFields} from "./base";

export interface UserDbFields extends BaseDbFields {
    email: string;
    password: string;
    is_admin: boolean;
    admin_notes: string;
    added_by_admin_uuid: string | null;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                                                                           *
 *                                                                           *
 *                               Transmission                                *
 *                                                                           *
 *                                                                           *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export function from_pojo(user: User_AdminView) {
    user = base_from_pojo(user);
    // user.is_admin = parse_bool(user.is_admin);
    return user;
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                                                                           *
 *                                                                           *
 *                                   Views                                   *
 *                                                                           *
 *                                                                           *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

export const USER_VIEW_KINDS = str_enum([
    "User_AdminView",
    "User_OwnerView",
    "User_PublicView",
]);
export type USER_VIEW_KIND = keyof typeof USER_VIEW_KINDS;

// tslint:disable-next-line
export interface User_AdminView extends BaseModel {
    kind: "User_AdminView";
    email: string;
    is_admin: boolean;
    admin_notes: string;
    added_by_admin_uuid: string | null;

    // Prevent password being set
    password?: undefined;
}

// tslint:disable-next-line
export interface User_OwnerView extends BaseModel {
    kind: "User_OwnerView";
    email: string;
    is_admin: boolean;

    // Prevent password and sensitive fields being set
    password?: undefined;
    admin_notes?: undefined;
    added_by_admin_uuid?: undefined;
}

// tslint:disable-next-line
export interface User_PublicView extends BaseModel {
    kind: "User_PublicView";

    // Prevent password and other public sensitive fields being set
    email?: undefined;
    password?: undefined;
    is_admin?: undefined;
    admin_notes?: undefined;
    added_by_admin_uuid?: undefined;
}

export type User_Views = User_AdminView | User_OwnerView | User_PublicView;
