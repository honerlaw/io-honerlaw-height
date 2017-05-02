import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany} from "typeorm";
import {ColumnTypes} from "typeorm/metadata/types/ColumnTypes";
import {Role} from "./role";
import {Friend} from "./friend";

@Entity()
export class Account {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type: ColumnTypes.STRING, unique: true})
    public username: string;

    @Column({type: ColumnTypes.STRING})
    public password: string;

    @ManyToMany((type) => Role, (role) => role.accounts, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    @JoinTable()
    public roles: Role[] = [];

    @OneToMany((type) => Friend, (friend) => friend.requestor, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    public requestedFriends: Friend[] = [];

    @OneToMany((type) => Friend, (friend) => friend.requestee, {
        cascadeInsert: true,
        cascadeUpdate: true,
        lazy: true
    })
    public friendRequests: Friend[] = [];

    @Column({type: ColumnTypes.DATETIME})
    public created: Date;

}
