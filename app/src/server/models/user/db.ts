import { DataTypes, Model } from "sequelize"

import {UserDbFields} from "../../../shared/models/user"
import {sequelize} from "../../utils/sequelize_db"
import {
    TABLE_NAMES,
    BASE_FIELDS,
    DEFINE_OPTIONS,
} from "../../base/db"

// Export
export {UserDbFields} from "../../../shared/models/user"

type UserFieldsType = {
    [P in keyof UserDbFields]: any
}

const USER_FIELDS: UserFieldsType = {
    ...BASE_FIELDS,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    admin_notes: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    added_by_admin_uuid: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}

export type UserDbInstance = Model<UserDbFields>

export type UserDbPartialFields = Partial<UserDbFields>

export const UserDb = sequelize.define<UserDbInstance, UserDbPartialFields>(
    TABLE_NAMES.USER, USER_FIELDS, DEFINE_OPTIONS<UserDbInstance>())
