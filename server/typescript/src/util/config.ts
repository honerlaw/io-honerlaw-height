import {ConnectionOptions} from "typeorm";
import {Account} from "../db/entity/account";
import {Role} from "../db/entity/role";
import {Friend} from "../db/entity/friend";

export const JWT_SECRET = "helloworld!";

export const DB_OPTIONS: ConnectionOptions = {
    driver: {
        type: "postgres",
        host: "",
        port: 5432,
        username: "",
        password: "",
        database: ""
    },
    logging: {
        logQueries: true,
        logSchemaCreation: true
    },
    autoSchemaSync: true,
    entities: [Account, Role, Friend]
};
