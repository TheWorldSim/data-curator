import * as _ from "lodash";
import * as Hapi from "hapi";

import {ServerAppData} from "../../../server/views/bootstrap/server_app";
import {get_server_for_tests} from "../../../server/main";
import {PATHS} from "../../../shared/paths";
import {ResponsePayload} from "../../../shared/api";
import {ERRORS} from "../../../shared/errors";
import {DANGER_force_sync_db_for_tests, seed_db} from "../../helper/db";
import {clear_app_cache, clean_up} from "../../helper/clean_up";
import {signin_user} from "../../helper/session";

describe("user session signout route", () => {

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

    it("rejects invalid signout", (done) => {

        const signout_request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNOUT,
        };

        server.inject(signout_request, (res_signout) => {

            const result = res_signout.result as ResponsePayload.SignOutErred;
            expect(result.message).toEqual(ERRORS.ALREADY_SIGNED_OUT);
            expect(res_signout.statusCode).toEqual(400);

            done();
        });
    });

    /**
     * Used in conjunction with next test
     */
    it(" -- tests clear cache between each run: set up signin", (done) => {

        const request: Hapi.InjectedRequestOptions = {
            method: "POST",
            url: PATHS.API_V1.SIGNIN,
            payload: {
                username_or_email: "a@b.c",
                password: "asdfasdf",
            },
        };

        server.inject(request, (res) => {

            expect(res.statusCode).toEqual(200);
            done();
        });
    });

    it(" -- tests clear cache between each run: test it", (done) => {

        const cache = (server.app as ServerAppData).sessions_cache;
        // tslint:disable-next-line
        const sids = _.keys((cache as any)._cache.connection.cache.sessions_cache);
        /**
         * Note this test can only fail if the signin test is performed before it.
         */
        expect(sids).toEqual([]);

        done();
    });

    it("accepts valid signout", (done) => {

        signin_user(server, { username_or_email: "a@b.c", password: "asdfasdf" })
        .then((cookie_for_header) => {

            const signout_request: Hapi.InjectedRequestOptions = {
                method: "POST",
                url: PATHS.API_V1.SIGNOUT,
                headers: { cookie: cookie_for_header }
            };
            try {
                server.inject(signout_request, (res_signout) => {

                      const result = res_signout.result as ResponsePayload.SignOutSuccess;
                      expect(result).toEqual({ status: "SIGNED_OUT" });
                      expect(res_signout.statusCode).toEqual(200);
                      done();
                });
            }
            catch (e) {
                expect(e).toBe({});
                done();
            }
        });

    });

    afterAll(clean_up);
});
