import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne} from "typeorm";
import {ColumnTypes} from "typeorm/metadata/types/ColumnTypes";
import {Role} from "./role";
import {Account} from "./account";

@Entity()
export class Friend {

    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne((type) => Account, (account) => account.requestedFriends, {
        cascadeAll: true,
        nullable: false
    })
    public requestor: Account;

    @ManyToOne((type) => Account, (account) => account.friendRequests, {
        cascadeAll: true,
        nullable: false
    })
    public requestee: Account;

    @Column({type: ColumnTypes.DATETIME, nullable: true})
    public accepted: Date;

    @Column({type: ColumnTypes.DATETIME})
    public created: Date;

}
