import * as express from "express";
import * as Constant from "./util/constant";
import * as Config from "./util/config";
import * as jwt from "jsonwebtoken";

import {getAccountRepository} from "./db/repository/account-repository";
import {Account} from "./db/entity/account";
import {Role} from "./db/entity/role";

interface ISecurityAccount {
    id: number;
}

export interface ISecurityRequest extends express.Request {
    user: ISecurityAccount;
}

declare type AuthResponse = ISecurityAccount | string;

function getToken(req: express.Request): string {
    if (req.header(Constant.AUTHORIZATION_HEADER)) {
        const header = req.header(Constant.AUTHORIZATION_HEADER).split(" ");
        if (header[0] === Constant.AUTHORIZATION_BEARER) {
            return header[1];
        }
    }
    if (req.query && req.query.token) {
        return req.query.token;
    }
    return null;
}

export async function expressAuthentication(request: express.Request,
                                            securityName: string,
                                            scopes?: string[]): Promise<AuthResponse> {

    if (securityName !== Constant.SECURITY_NAME) {
        return Promise.reject("Unauthorized!");
    }

    const token: string = getToken(request);

    if (token === null) {
        return Promise.reject("Unauthorized!");
    }

    try {
        const decoded: ISecurityAccount = jwt.verify(token, Config.JWT_SECRET);

        if (!scopes || scopes.length === 0) {
            return Promise.resolve(decoded);
        }

        const account: Account = await (await getAccountRepository()).findOneById(decoded.id, {
            alias: "account",
            leftJoinAndSelect: {
                roles: "account.roles"
            }
        });

        if (!account) {
            return Promise.reject("Unauthorized!");
        }

        const roles: Role[] = await account.roles;
        const found: boolean = roles.some((role) => scopes.indexOf(role.role) !== -1);
        if (found !== true) {
            return Promise.reject("Unauthorized!");
        }

        return Promise.resolve(decoded);
    } catch (err) {
        return Promise.reject(err);
    }
}

export function createToken(account: Account): string {
    return jwt.sign({
        id: account.id
    }, Config.JWT_SECRET);
}
