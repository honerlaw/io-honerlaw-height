import * as bcrypt from "bcrypt";
import {Singleton} from "../util/ioc";
import {getAccountRepository, AccountRepository} from "../db/repository/account-repository";
import {getRoleRepository, RoleRepository} from "../db/repository/role-repository";
import {Account} from "../db/entity/account";
import {Role} from "../db/entity/role";
import GenericResponse from "../response/generic-response";

interface IAccountService {
    login: (username: string, password: string) => Promise<Account>;
    exists: (username: string) => Promise<boolean>;
    create: (username: string, hash: string) => Promise<Account>;
}

@Singleton(AccountService)
export class AccountService implements IAccountService {

    public async findOneById(id: number): Promise<Account> {
        return await (await getAccountRepository()).findOneById(id);
    }

    public async login(username: string, password: string): Promise<Account> {
        const repo: AccountRepository = await getAccountRepository();
        const account: Account = await repo.findByUsername(username);

        if (account === undefined) {
            return Promise.resolve(null);
        }

        const valid: boolean = await bcrypt.compare(password, account.password);
        if (valid) {

            // remove the password hash from the result
            delete account.password;

            return Promise.resolve(account);
        }

        return Promise.resolve(null);
    }

    public async exists(username: string): Promise<boolean> {
        const repo: AccountRepository = await getAccountRepository();
        const account: Account = await repo.findByUsername(username);
        return Promise.resolve(account !== undefined);
    }

    public async changePassword(id: number, password: string): Promise<Account> {
        const repo: AccountRepository = await getAccountRepository();

        const account: Account = await repo.findOneById(id);
        account.password = await bcrypt.hash(password, 10);

        const updated: Account = await repo.persist(account);

        // remove the password hash from the result
        delete updated.password;

        return Promise.resolve(updated);
    }

    public async create(username: string, password: string): Promise<Account> {

        const repo: AccountRepository = await getAccountRepository();

        const account: Account = repo.create();
        account.username = username.toLocaleLowerCase();
        account.password = await bcrypt.hash(password, 10);
        account.created = new Date();

        const roleRepo: RoleRepository = await getRoleRepository();
        const role: Role = await roleRepo.findOneByRole("user");

        account.roles = [role];

        const created: Account = await repo.persist(account);

        return Promise.resolve(created);
    }

    public async validatePassword(password: string, vpassword: string): Promise<GenericResponse> {
        if (!password || password.trim().length === 0 || !vpassword || vpassword.trim().length === 0) {
            return Promise.reject({message: "Password and verification password are required!"});
        }
        if (vpassword !== password) {
            return Promise.reject({message: "Passwords do not match"});
        }
        if (password.length < 6) {
            return Promise.reject({message: "Password must be at least 6 characters in length."});
        }
        return null;
    }

    public async delete(account: Account): Promise<boolean> {

        const repo: AccountRepository = await getAccountRepository();

        return new Promise<boolean>((resolve) => {
            repo.remove(account)
                .then(() => resolve(true))
                .catch(() => resolve(false));
        });
    }

}
