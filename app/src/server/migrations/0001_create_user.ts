import * as SequelizeImport from "sequelize";

import {BASE_FIELDS, TABLE_NAMES} from "../base/db";

export = {
    up: function(queryInterface: SequelizeImport.QueryInterface, Sequelize: SequelizeImport.SequelizeStatic) {

        const USER_FIELDS = {
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
        return queryInterface.createTable(TABLE_NAMES.USER, USER_FIELDS);
    },

    down: function(queryInterface: SequelizeImport.QueryInterface) {

        return queryInterface.dropTable(TABLE_NAMES.USER);
    }
};
