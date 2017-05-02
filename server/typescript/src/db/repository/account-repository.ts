import {Account} from "../entity/Account";
import {EntityRepository, Repository} from "typeorm";
import {getConnection} from "../entity-service";

// @todo for some unknown reason Connection.getMetadata throws an exception and cannot find the metadata
// @todo it compares the constructor functions and for some unknown reason the functions are not equivalent
// @todo so I believe at some point the constructor is copied (so they are not pointing to the same point in memory)
// @todo for now I simply changed Connection.getMetadata to compare the string version of the functions
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {

    public async findByUsername(username: string): Promise<Account> {
        return this.findOne({
            username: username.toLocaleLowerCase()
        });
    }

}

export async function getAccountRepository(): Promise<AccountRepository> {
    return await (await getConnection()).getCustomRepository<AccountRepository>(AccountRepository);
}
