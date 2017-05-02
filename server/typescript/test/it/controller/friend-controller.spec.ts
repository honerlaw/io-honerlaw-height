import * as http from "http";
import {init} from "../../../src/server";
import {deleteAccountAndPersist, createAccountAndPersist} from "../it-helper";
import {Account} from "../../../src/db/entity/account";

describe("FriendController IT Tests", () => {

    let server: http.Server;
    let requestor: Account;
    let requestee: Account;

    before(async () => {
        server = await init();
        requestor = await createAccountAndPersist("requestor");
        requestee = await createAccountAndPersist("requestee");
    });

    after(async () => {
        await deleteAccountAndPersist(requestor);
        await deleteAccountAndPersist(requestee);
        await server.close();
    });

    it("should do things", async () => {

        console.log("hello world!");

    });

});
