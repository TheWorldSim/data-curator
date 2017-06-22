import * as Boom from "boom";
import * as Hapi from "hapi";
import * as Joi from "joi";

// import {routes} from "../../../server/user_registration/routes";  // Could test routes by themselves
import {get_server_for_tests} from "../../../server/main";
import {PATHS} from "../../../shared/paths";
import {ResponsePayload} from "../../../shared/api";
import {ERRORS} from "../../../shared/errors";
import {DANGER_force_sync_db_for_tests, seed_db} from "../../helper/db";
import {clear_db, clean_up} from "../../helper/clean_up";

describe("user registration routes", () => {

    let server: Hapi.Server;
    beforeAll((done) => {

        get_server_for_tests()
        .then((server_for_tests) => {
            server = server_for_tests;
            return DANGER_force_sync_db_for_tests();
        })
        .then(done);
        // server = new Hapi.Server();  // Could test routes by themselves
        // server.connection();         // Could test routes by themselves
        // routes(server);              // Could test routes by themselves
    });

    beforeEach((done) => {

        clear_db().then(done);
    });

    it("works with correct payload", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.USER_REGISTER,
            payload: {
                email: "a@b.c",
                password: "somelongpassword",
            },
        };

        server.inject(request, (res) => {

            const result = res.result as ResponsePayload.RegisterUserSuccess;
            const schema = Joi.object().keys({
                data: Joi.object().keys({
                    kind: Joi.allow("User_OwnerView"),
                    uuid: Joi.string().length(36),
                    created_at: Joi.date(),
                    modified_at: Joi.date(),
                    deleted_at: Joi.allow(null),
                    email: Joi.allow("a@b.c"),
                    is_admin: Joi.allow(false),
                }),
            });
            let valid = Joi.validate(result, schema, {presence: "required"});

            expect(res.statusCode).toEqual(200);
            expect(valid.error).toEqual(null);

            done();
        });
    });

    // TODO update so that the previous test does not need to run in order for
    // this test to pass.
    it("errors with non unique email address", (done) => {

        seed_db()
        .then(() => {

            const request: Hapi.InjectedRequestOptions = {
                method: "POST",
                url: PATHS.API_V1.USER_REGISTER,
                payload: {
                    email: "a@b.c",
                    password: "somelongpassword",
                },
            };

            server.inject(request, function(res) {

                const result = res.result as Boom.Payload;
                expect(res.statusCode).toEqual(400);
                expect(result.message).toEqual(ERRORS.EMAIL_ALREADY_REGISTERED);

                done();
            });
        });
    });

    it("errors on no payload", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.USER_REGISTER,
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
            url: PATHS.API_V1.USER_REGISTER,
            payload: {
                email: "a@b.c",
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
            url: PATHS.API_V1.USER_REGISTER,
            payload: {
                password: "somelongpassword",
            },
        };

        server.inject(request, function(res) {

            expect(res.result).toEqual({
                error: "Bad Request",
                message: "child \"email\" fails because [\"email\" is required]",
                statusCode: 400,
                validation: {
                    keys: ["email"],
                    source: "payload",
                },
            });

            done();
        });
    });

    it("errors on bad email", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.USER_REGISTER,
            payload: {
                email: "a@",
                password: "somelongpassword",
            },
        };

        server.inject(request, function(res) {

            expect(res.result).toEqual({
                error: "Bad Request",
                message: "child \"email\" fails because [\"email\" must be a valid email]",
                statusCode: 400,
                validation: {
                    keys: ["email"],
                    source: "payload",
                },
            });

            done();
        });
    });

    it("errors on insufficient password", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.USER_REGISTER,
            payload: {
                email: "a@b.c",
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
