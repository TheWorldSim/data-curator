/**
 * This script, when run as development with:
 *      app$ NODE_ENV=development node compiled_all/bin/seed_db.js
 * will seed the database.
 */

import Sequelize = require("sequelize");

import {UserDb, UserDbFields} from "../server/models/user/db";

const NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV !== "development") {

    throw new Error(`Must call script with NODE_ENV=development but called with: ${NODE_ENV}`);

} else {

    /**
     * We already have the app_id etc stored in the .env.* file so extract
     * and store in db
     */

    const date = new Date(Date.parse("2017-01-01 01:01:01.000+01"));
    const user: UserDbFields = {
        uuid: "ba66a0b8-04bb-4e57-a23a-dd86822b099f",
        created_at: date,
        modified_at: date,
        deleted_at: null,
        email: "a@b.c",
        // password is: asdfasdf
        password: ("pbkdf2$10000$86a50ab369c053240b95dc53c50ad5c492dacd296e54f9e" +
            "d4cb7a00856ae3d422619325f25787fc8e47d42e04ea279946536981eae2b1d806c" +
            "6a2161cbe34542$6574845175627537ae83593aa5cdc9b9640776d6e2a991f45d40" +
            "d6814b2df6e3cf9c2f34bb07f141d63fc250cd6ba7bdfdc610e0f7ee8978bfb4ce0" +
            "6c9651211"),
        is_admin: false,
        added_by_admin_uuid: null,
        admin_notes: "levelheaded and considerate",
    };

    console.log("INFO:  Seeding db.");

    // seed user table

    UserDb.create(user)
    .then(() => {

        console.log(`SUCCESS:  Saved a test user to db with email: ${user.email} and password: "asdfasdf".`);
    }, (err) => {

        if (err instanceof Sequelize.UniqueConstraintError) {
            console.error(`ERROR:  Duplicate of the test user already found in db.  Skipping saving user to db.`);
            process.exit(1);
            return;
        }

        console.error(`ERROR:  whilst trying to add a test user to db:\n\n  `, err);
        process.exit(1);
    })

    // exit

    .then(() => {

        process.exit(0);
    });
}
