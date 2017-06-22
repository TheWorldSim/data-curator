/**
 * Run with  `node compiled_all/bin/demo_sequelize.js`
 */

import * as _ from "lodash";
import Sequelize = require("sequelize");

let CONFIG = {
    DB_ENV_DATABASE: "test",
    DB_ENV_USERNAME: "postgres",
    DB_ENV_PASSWORD: "",
    DB_ENV_HOST: "127.0.0.1",
    DB_ENV_PORT: 5432,
    DB_ENV_DIALECT: "postgres",
};

function logger(msg: any) {
    console.log(msg);
}

let config = {
    protocol: "postgres",
    host: CONFIG.DB_ENV_HOST,
    port: CONFIG.DB_ENV_PORT,
    dialect: CONFIG.DB_ENV_DIALECT,
    pool: {
        max: 10,
        min: 1,
        idle: 10000,
    },
    logging: logger,
    dialectOptions: {
        ssl: false,
    },
    allowNull: false,
};

let sequelize = new Sequelize(CONFIG.DB_ENV_DATABASE, CONFIG.DB_ENV_USERNAME, CONFIG.DB_ENV_PASSWORD, config);

let UserFields: Sequelize.DefineAttributes = {
    uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    created_at: {
        type: Sequelize.DATE(6),
        // allowNull: false,
    },
    modified_at: {
        type: Sequelize.DATE(6),
        // allowNull: true,
    },
    deleted_at: {
        type: Sequelize.DATE(6),
        // allowNull: true,
    },
    email: {
        type: Sequelize.STRING,
        // allowNull: false,
        unique: true,
    },
};

interface UserDbFields {
    uuid: string;
    created_at: Date;
    modified_at: Date | null;
    deleted_at: Date | null;
    email: string;
}
type UserDbInstance = Sequelize.Instance<UserDbFields>;

let DEFINE_OPTIONS: Sequelize.DefineOptions<UserDbInstance> = {
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    // We specify these explicitly even though sequelize does a fine job of this
    createdAt: "created_at",
    deletedAt: "deleted_at",
    updatedAt: "modified_at",
};

const NULLABLE_MODEL_FIELDS: {[model_name: string]: string[]} = {
    "demo_user": ["deleted_at"]
};

sequelize.beforeDefine((attributes, options) => {

    // May break if name is defined by a string rather than object with {singular, plural}?
    const NULLABLE_FIELDS = NULLABLE_MODEL_FIELDS[options["name"]["singular"]] || {};

    _.keys(attributes).forEach((field_name) => {

        var field_definition = attributes[field_name];
        if (!_.isString(field_definition) && !_.isUndefined(field_definition["type"])) {
            const nullable = _.includes(NULLABLE_FIELDS, field_name);
            (field_definition as Sequelize.DefineAttributeColumnOptions).allowNull = nullable;
        }
    });
});

let UserDb = sequelize.define<UserDbInstance, Partial<UserDbFields>>("demo_user", UserFields, DEFINE_OPTIONS);

function usersToJson(users: UserDbInstance[]) {
    return users.reduce(function(prev: UserDbFields[], user){ prev.push(user.toJSON()); return prev; }, []);
}

UserDb.sync({force: true})
.then(() => {
    console.log("\nSync'd user table");
    return UserDb.create({
        email: "John",
    });
})
.then((user) => {
    let new_user = user.toJSON();
    console.log("\ncreated user:", new_user);

    return UserDb.findOne({where: {uuid: new_user.uuid}});
})
.then((found_user) => {
    const user = found_user!.toJSON();
    console.log("\nfound user:", user);
    return UserDb.findAll({where: {uuid: user.uuid}});
})
.then((users) => {
    console.log("\nfound users:", usersToJson(users));
    return UserDb.findAll({where: {uuid: "abcdef01-2345-6789-abcd-ef0123456789"}});
})
.then((users) => {
    if (users.length) throw new Error("Really?!  That was a 1 in 3.402823669 E38 chance.  Buy a lottery ticket.  Now!  ;)");
    console.log("\ncorrectly found no users:", usersToJson(users));
    return UserDb.update({modified_at: new Date()}, {where: {}, returning: true});
})
.then((result) => {
    let num = result[0];
    let users = result[1];
    console.log("\nfound " + num + " users whilst updating them:", usersToJson(users));
});
