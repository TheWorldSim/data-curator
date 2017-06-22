import {UserDbFields} from "../../server/models/user/db";
import {User_OwnerView} from "../../shared/models/user";

const date = new Date(Date.parse("2017-01-01 01:01:01.000+01"));

const partial_user = {
    created_at: date,
    modified_at: date,
    deleted_at: null,
};

const partial_server_user = {
    password: "salted hash goes here $£%HFD$%^&&G£@",
    added_by_admin_uuid: null,
    admin_notes: "levelheaded and considerate",
};

const partial_admin_user = {
    uuid: "ba66a0b8-04bb-4e57-a23a-dd86822b099f",
    // name: "Alex Smith",
    created_at: date,
    modified_at: date,
    email: "a@b.c",
    is_admin: true,
};

export const PASSWORD = "asdfasdf";

const partial_user_with_password = {
    // password is: asdfasdf
    password: ("pbkdf2$10000$86a50ab369c053240b95dc53c50ad5c492dacd296e54f9e" +
        "d4cb7a00856ae3d422619325f25787fc8e47d42e04ea279946536981eae2b1d806c" +
        "6a2161cbe34542$6574845175627537ae83593aa5cdc9b9640776d6e2a991f45d40" +
        "d6814b2df6e3cf9c2f34bb07f141d63fc250cd6ba7bdfdc610e0f7ee8978bfb4ce0" +
        "6c9651211"),
};

export function server_admin_user(): UserDbFields {
    return {
        ...partial_user,
        ...partial_server_user,
        ...partial_admin_user,
        ...partial_user_with_password,
    };
}

export function api_admin_user(): User_OwnerView {
    return {
        ...partial_user,
        ...partial_admin_user,
        kind: "User_OwnerView",
    };
}

const partial_normal_user = {
    uuid: "4ff930c7-43c0-51e8-d973-2b513a1305f9",
    // name: "Charlie Dee",
    email: "c@d.e",
    is_admin: false,
};

export function server_normal_user(): UserDbFields {
    return {
        ...partial_user,
        ...partial_server_user,
        ...partial_normal_user,
        ...partial_user_with_password,
    };
}

export function api_normal_user(): User_OwnerView {
    return {
        ...partial_user,
        ...partial_normal_user,
        kind: "User_OwnerView",
    };
}
