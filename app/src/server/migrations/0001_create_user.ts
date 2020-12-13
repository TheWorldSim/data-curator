import { QueryInterface, Sequelize, DataTypes } from "sequelize";

import {BASE_FIELDS, TABLE_NAMES} from "../base/db";

export = {
    up: function(queryInterface: QueryInterface, Sequelize: Sequelize) {

        const USER_FIELDS = {
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
        };
        return queryInterface.createTable(TABLE_NAMES.USER, USER_FIELDS);
    },

    down: function(queryInterface: QueryInterface) {

        return queryInterface.dropTable(TABLE_NAMES.USER);
    }
};
