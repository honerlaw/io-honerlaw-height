import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import {ColumnTypes} from "typeorm/metadata/types/ColumnTypes";
import {Account} from "./account";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: ColumnTypes.STRING, unique: true})
    public role: string;

    @ManyToMany((type) => Account, (account) => account.roles, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    public accounts: Account[] = [];

    @Column({type: ColumnTypes.DATETIME})
    public created: Date;

}
