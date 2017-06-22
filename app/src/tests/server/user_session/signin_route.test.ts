import * as Hapi from "hapi";
import * as Joi from "joi";

import {get_server_for_tests} from "../../../server/main";
import {PATHS} from "../../../shared/paths";
import {ResponsePayload} from "../../../shared/api";
import {ERRORS} from "../../../shared/errors";
import {LOG_TAGS} from "../../../shared/constants";
import {DANGER_force_sync_db_for_tests, seed_db} from "../../helper/db";
import {clear_app_cache, clean_up} from "../../helper/clean_up";

describe("user session signin route", () => {

    let server: Hapi.Server;
    beforeAll((done) => {

        get_server_for_tests()
        .then((server_for_tests) => {
            server = server_for_tests;
            return;
        })
        .then(DANGER_force_sync_db_for_tests)
        .then(seed_db)
        .then(done);
    });

    beforeEach((done) => {

        clear_app_cache(server)
        .then(done)
        .catch((err) => {
            console.error(err);
            throw err;
        });
    });

    it("accepts valid signin", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNIN,
            payload: {
                username_or_email: "a@b.c",
                password: "asdfasdf",
            },
        };

        server.inject(request, (res) => {

            const result = res.result as ResponsePayload.RegisterUserSuccess;
            const schema = Joi.object().keys({
                status: Joi.allow("SIGNED_IN", "SIGNED_OUT"),
                data: Joi.object().keys({
                    user: Joi.object().keys({
                        kind: Joi.allow("User_OwnerView"),
                        uuid: Joi.string().length(36),
                        created_at: Joi.date(),
                        modified_at: Joi.date(),
                        deleted_at: Joi.allow(null),
                        email: Joi.allow("a@b.c"),
                        is_admin: Joi.allow(false),
                    }),
                }),
            });

            expect(res.statusCode).toEqual(200);
            expect(JSON.parse(res.payload).data.user.email).toEqual("a@b.c");
            let valid = Joi.validate(result, schema, {presence: "required"});
            expect(valid.error).toEqual(null);
            done();
        });
    });

    it("errors with invalid password", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNIN,
            payload: {
                username_or_email: "a@b.c",
                password: "somelongpassword",
            },
        };

        spyOn(server, "log");
        server.inject(request, function(res) {

            let result = res.result as ResponsePayload.RegisterUserFailed;

            expect(res.statusCode).toEqual(401);
            expect(result.message).toEqual(ERRORS.EMAIL_OR_PASSWORD_NOT_RECOGNISED);
            const expected = "Found user ba66a0b8-04bb-4e57-a23a-dd86822b099f by their email address " +
                "but their password did not match. [potential security attack attempting to guess password]";
            expect(server.log).toHaveBeenCalledWith(LOG_TAGS.SECURITY, expected);

            done();
        });
    });

    it("errors with invalid email", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNIN,
            payload: {
                username_or_email: "not@in.db",
                password: "somelongpassword",
            },
        };

        spyOn(server, "log");
        server.inject(request, function(res) {

            let result = res.result as ResponsePayload.RegisterUserFailed;

            expect(res.statusCode).toEqual(401);
            expect(result.message).toEqual(ERRORS.EMAIL_OR_PASSWORD_NOT_RECOGNISED);
            const expected = "Could not find user with email: not@in.db [potential security " +
                "attack attempting to find registered emails]";
            expect(server.log).toHaveBeenCalledWith(LOG_TAGS.SECURITY, expected);

            done();
        });
    });

    it("errors on no payload", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNIN,
        };

        server.inject(request, function(res) {

            expect(res.statusCode).toEqual(400);
            expect(res.statusMessage).toEqual("Bad Request");
            expect(res.result).toEqual({
                error: "Bad Request",
                message: "\"value\" must be an object",
                statusCode: 400,
                validation: {
                    keys: ["value"],
                    source: "payload",
                },
            });

            done();
        });
    });

    it("errors on no password", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNIN,
            payload: {
                username_or_email: "a@b.c",
            },
        };

        server.inject(request, function(res) {

            expect(res.result).toEqual({
                error: "Bad Request",
                message: "child \"password\" fails because [\"password\" is required]",
                statusCode: 400,
                validation: {
                    keys: ["password"],
                    source: "payload",
                },
            });

            done();
        });
    });

    it("errors on no email", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNIN,
            payload: {
                password: "somelongpassword",
            },
        };

        server.inject(request, function(res) {

            expect(res.result).toEqual({
                error: "Bad Request",
                message: "child \"username_or_email\" fails because [\"username_or_email\" is required]",
                statusCode: 400,
                validation: {
                    keys: ["username_or_email"],
                    source: "payload",
                },
            });

            done();
        });
    });

    it("errors on bad email", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNIN,
            payload: {
                username_or_email: "a@",
                password: "somelongpassword",
            },
        };

        server.inject(request, function(res) {

            expect(res.result).toEqual({
                error: "Bad Request",
                message: "child \"username_or_email\" fails because [\"username_or_email\" must be a valid email]",
                statusCode: 400,
                validation: {
                    keys: ["username_or_email"],
                    source: "payload",
                },
            });

            done();
        });
    });

    it("errors on insufficient password", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNIN,
            payload: {
                username_or_email: "a@b.c",
                password: "pass",
            },
        };

        server.inject(request, function(res) {

            expect(res.result).toEqual({
                error: "Bad Request",
                message: "child \"password\" fails because [\"password\" length must be at least 7 characters long]",
                statusCode: 400,
                validation: {
                    keys: ["password"],
                    source: "payload",
                },
            });

            done();
        });
    });

    afterAll(clean_up);
});
