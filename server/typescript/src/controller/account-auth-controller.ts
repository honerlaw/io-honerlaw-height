import {Route, Post, Body} from "tsoa";
import {Singleton, Inject} from "../util/ioc";
import {AccountService} from "../service/account-service";
import {createToken} from "../security";
import {Account} from "../db/entity/account";
import GenericResponse from "../response/generic-response";

interface ILoginRequest {
    readonly username: string;
    readonly password: string;
}

interface IRegisterRequest {
    readonly username: string;
    readonly password: string;
    readonly vpassword: string;
}

@Route("account/auth")
@Singleton(AccountAuthController)
export class AccountAuthController {

    private readonly accountService: AccountService;

    constructor(@Inject(AccountService) accountService: AccountService) {
        this.accountService = accountService;
    }

    @Post("login")
    public async login(@Body() request: ILoginRequest): Promise<GenericResponse | string> {
        const account: Account = await this.accountService.login(request.username, request.password);

        if (account === null) {
            return Promise.reject({message: "Invalid username or password!"});
        }

        return Promise.resolve(createToken(account));
    }

    @Post("register")
    public async register(@Body() request: IRegisterRequest): Promise<GenericResponse | string> {

        await this.accountService.validatePassword(request.password, request.vpassword);

        if (await this.accountService.exists(request.username)) {
            return Promise.reject({message: "Username is already in use!"});
        }

        try {
            const account: Account = await this.accountService.create(request.username, request.password);
            return Promise.resolve(createToken(account));
        } catch (err) {
            console.log(err);
            return Promise.reject({message: "Failed to create account! Please try again!"});
        }
    }

}
