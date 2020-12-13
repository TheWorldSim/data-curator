/**
 * Run with  `node compiled_all/scripts/demo_sequelize.js`
 */

import * as _ from "lodash"
import { Dialect, Model, ModelAttributeColumnOptions, ModelOptions, Options } from "sequelize"
import { Sequelize, DataTypes, UUIDV4 } from "sequelize"

const CONFIG = {
    DB_ENV_DATABASE: "test",
    DB_ENV_USERNAME: "postgres",
    DB_ENV_PASSWORD: "",
    DB_ENV_HOST: "127.0.0.1",
    DB_ENV_PORT: 5432,
    DB_ENV_DIALECT: "postgres" as Dialect,
}

function logger(msg: any) {
    console.log(msg)
}

const config: Options = {
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
}

const sequelize = new Sequelize(CONFIG.DB_ENV_DATABASE, CONFIG.DB_ENV_USERNAME, CONFIG.DB_ENV_PASSWORD, config)

const UserFields: { [field_name: string]: ModelAttributeColumnOptions } = {
    uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
    },
    created_at: {
        type: DataTypes.DATE(6),
        // allowNull: false,
    },
    modified_at: {
        type: DataTypes.DATE(6),
        // allowNull: true,
    },
    deleted_at: {
        type: DataTypes.DATE(6),
        // allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        // allowNull: false,
        unique: true,
    },
}

interface UserDbFields {
    uuid: string
    created_at: Date
    modified_at: Date | null
    deleted_at: Date | null
    email: string
}
type UserDbInstance = Model<UserDbFields>

const DEFINE_OPTIONS: ModelOptions<UserDbInstance> = {
    paranoid: true,
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    // We specify these explicitly even though sequelize does a fine job of this
    createdAt: "created_at",
    deletedAt: "deleted_at",
    updatedAt: "modified_at",
}

const NULLABLE_MODEL_FIELDS: {[model_name: string]: string[]} = {
    "demo_user": ["deleted_at"]
}

sequelize.beforeDefine((attributes, options) => {

    // May break if name is defined by a string rather than object with {singular, plural}?
    const NULLABLE_FIELDS = NULLABLE_MODEL_FIELDS[(options as any)["name"]["singular"]] || {}

    _.keys(attributes).forEach((field_name) => {

        var field_definition = attributes[field_name]
        if (!_.isString(field_definition) && !_.isUndefined(field_definition["type"])) {
            const nullable = _.includes(NULLABLE_FIELDS, field_name)
            ;(field_definition as ModelAttributeColumnOptions).allowNull = nullable
        }
    })
})

const UserDb = sequelize.define<UserDbInstance, Partial<UserDbFields>>("demo_user", UserFields, DEFINE_OPTIONS)

function usersToJson(users: UserDbInstance[]) {
    return users.reduce(function(accum: UserDbFields[], user){
        accum.push(user.toJSON() as any);
        return accum
    }, [])
}

UserDb.sync({force: true})
.then(() => {
    console.log("\nSync'd user table")
    return UserDb.create({
        email: "John",
    } as any)
})
.then((user) => {
    const new_user = user.toJSON() as UserDbFields
    console.log("\ncreated user:", new_user)

    return UserDb.findOne({where: {uuid: new_user.uuid}})
})
.then((found_user) => {
    const user = found_user!.toJSON() as UserDbFields
    console.log("\nfound user:", user)
    return UserDb.findAll({where: {uuid: user.uuid}})
})
.then((users) => {
    console.log("\nfound users:", usersToJson(users))
    return UserDb.findAll({where: {uuid: "abcdef01-2345-6789-abcd-ef0123456789"}})
})
.then((users) => {
    if (users.length) throw new Error("Really?!  That was a 1 in 3.402823669 E38 chance.  Buy a lottery ticket.  Now!  )")
    console.log("\ncorrectly found no users:", usersToJson(users))
    return UserDb.update({modified_at: new Date()}, {where: {}, returning: true})
})
.then((result) => {
    const num = result[0]
    const users = result[1]
    console.log("\nfound " + num + " users whilst updating them:", usersToJson(users))
})
