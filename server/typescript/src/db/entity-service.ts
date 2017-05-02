import {createConnection, Connection} from "typeorm";
import * as Config from "../util/config";

let connection: Connection = null;

export async function getConnection(): Promise<Connection> {
    if (connection === null) {
        connection = await createConnection(Config.DB_OPTIONS);
    }
    return connection;
}
