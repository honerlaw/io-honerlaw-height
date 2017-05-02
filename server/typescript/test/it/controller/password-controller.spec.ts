import * as chai from "chai";
import * as http from "http";
import * as request from "request";
import {init} from "../../../src/server";
import {createAccountAndPersist, deleteAccountAndPersist} from "../it-helper";
import {Account} from "../../../src/db/entity/account";
import {createToken} from "../../../src/security";

// @todo in order to set the timeout, the index.d.ts for mocha must be modified to allow the suite param
describe("PasswordController IT Tests", () => {

    let account: Account;
    let server: http.Server;

    before(async () => {
        server = await init();
        account = await createAccountAndPersist("passwordControllerTest");
    });

    after(async () => {
        await deleteAccountAndPersist(account);
        await server.close();
    });

    it("should change the user's password", (done) => {
        const token: string = createToken(account);

        request.post("http://127.0.0.1:8002/api/v1/account/password/change", {
            headers: {
                Authorization: "Bearer " + token
            },
            form: {
                password: "awesome",
                vpassword: "awesome"
            }
        }, (error: any, response: request.RequestResponse, body: any) => {
            chai.expect(response.statusCode).to.equal(200);
            chai.expect(JSON.parse(body).message).to.equal("OK");
            done();
        });
    });

});
