import "reflect-metadata";
import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";

import {RegisterRoutes} from "./routes";
import {getConnection} from "./db/entity-service";
import "./controller/account-auth-controller";
import "./controller/password-controller";
import "./controller/friend-controller";

export async function init(): Promise<http.Server> {

    const app: express.Application = express();

    // register body parser middleware
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    RegisterRoutes(app);

    return new Promise<http.Server>((resolve, reject) => {
        getConnection().then(() => {
            const server = app.listen(8002, () => resolve(server));
        }).catch(reject);
    });
}
