import * as Hapi from "hapi";

import {get_server_for_tests} from "../../../server/main";
import {PATHS} from "../../../shared/paths";
import {ResponsePayload} from "../../../shared/api";
import {DANGER_force_sync_db_for_tests, seed_db} from "../../helper/db";
import {clean_up} from "../../helper/clean_up";
import {signin_user} from "../../helper/session";

describe("protected route", () => {

    let server: Hapi.Server;
    let cookie_for_header: string;
    beforeAll((done) => {

        get_server_for_tests()
        .then((server_for_tests) => {
            server = server_for_tests;
            return;
        })
        .then(DANGER_force_sync_db_for_tests)
        .then(seed_db)
        .then(() => signin_user(server))
        .then((cookie) => {
            cookie_for_header = cookie;
        })
        .then(done);
    });

    it("provides protected resource", (done) => {

        const protected_request: Hapi.InjectedRequestOptions = {
            method: "GET",
            url: PATHS.API_V1.PROTECTED,
            headers: { cookie: cookie_for_header },
        };

        server.inject(protected_request, (res_protected) => {

            const result = res_protected.result as ResponsePayload.ProtectedData;
            expect(result).toContain("you are in");
            expect(res_protected.statusCode).toEqual(200);

            done();
        });
    });

    afterAll(clean_up);
});
