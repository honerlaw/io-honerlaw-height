import {Repository, EntityRepository} from "typeorm";
import {Role} from "../entity/role";
import {getConnection} from "../entity-service";

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {

    public async findOneByRole(role: string): Promise<Role> {
        return this.findOne({
            role
        });
    }

}

export async function getRoleRepository(): Promise<RoleRepository> {
    return await (await getConnection()).getCustomRepository<RoleRepository>(RoleRepository);
}
