import * as Sequelize from "sequelize";

import {UserDbFields} from "../../../shared/models/user";
export {UserDbFields} from "../../../shared/models/user";
import {sequelize} from "../../utils/sequelize_db";
import {
    TABLE_NAMES,
    BASE_FIELDS,
    DEFINE_OPTIONS,
} from "../../base/db";

type UserFieldsType = {
    [P in keyof UserDbFields]: string | Sequelize.DataTypeAbstract | Sequelize.DefineAttributeColumnOptions;
};

const USER_FIELDS: UserFieldsType = {
    ...BASE_FIELDS,
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    is_admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    admin_notes: {
        type: Sequelize.STRING,
        defaultValue: "",
    },
    added_by_admin_uuid: {
        type: Sequelize.STRING,
        allowNull: true,
    },
};

export type UserDbInstance = Sequelize.Instance<UserDbFields>;

export type UserDbPartialFields = Partial<UserDbFields>;

export const UserDb = sequelize.define<UserDbInstance, UserDbPartialFields>(
    TABLE_NAMES.USER, USER_FIELDS, DEFINE_OPTIONS<UserDbInstance>());
