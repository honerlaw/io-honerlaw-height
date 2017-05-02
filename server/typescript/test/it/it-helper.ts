import {createToken} from "../../src/security";
import {Account} from "../../src/db/entity/account";
import {iocContainer} from "../../src/util/ioc";
import {AccountService} from "../../src/service/account-service";

export async function createAccountAndPersist(username: string): Promise<Account> {

    const accountService: AccountService = iocContainer.get(AccountService);

    const account: Account = await accountService.create(username, "unknown");

    return Promise.resolve(account);
}

export async function deleteAccountAndPersist(account: Account): Promise<boolean> {
    return await iocContainer.get(AccountService).delete(account);
}
