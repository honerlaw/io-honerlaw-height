import {expect} from "chai";
import * as jwt from "jsonwebtoken";
import * as express from "express";

import {Account} from "../../src/db/entity/account";
import {expressAuthentication, createToken} from "../../src/security";
import * as Config from "../../src/util/config";

describe("Security", () => {

    it("test that invalid security name fails", (done) => {
        const request: express.Request = {} as any;
        const resp: Promise<any> = expressAuthentication(request, "unknown");
        resp.catch((err) => {
            expect(err).to.equal("Unauthorized!");
            done();
        });
    });

    it("test create token", () => {
        // build the token
        const account: Account = {
            id: 1
        } as any;
        const token: string = createToken(account);

        // validate the created token
        const decoded = jwt.verify(token, Config.JWT_SECRET);
        expect(decoded.id).to.equal(1);
    });

    it("test that valid credentials pass", (done) => {

        const account: Account = {
            id: 3 // @todo should add temporary account to database to test
        } as any;
        const token: string = createToken(account);
        const request: express.Request = {
            header: () => undefined,
            query: {
                token
            }
        } as any;

        const resp: Promise<any> = expressAuthentication(request, "jwt");

        resp.then((info) => {
            expect(info.id).to.equal(3);
            done();
        });
    });

});
