import {Route, Post, Security, Request} from "tsoa";
import {ISecurityRequest} from "../security";
import {Singleton, Inject} from "../util/ioc";
import {AccountService} from "../service/account-service";
import GenericResponse from "../response/generic-response";

@Route("account/password")
@Singleton(PasswordController)
export class PasswordController {

    private accountService: AccountService;

    constructor(@Inject(AccountService) accountService: AccountService) {
        this.accountService = accountService;
    }

    @Post("change")
    @Security("jwt")
    public async change(@Request() request: ISecurityRequest): Promise<GenericResponse> {
        const id: number = request.user.id;

        const password: string = request.body.password;
        const vpassword: string = request.body.vpassword;

        await this.accountService.validatePassword(password, vpassword);

        await this.accountService.changePassword(id, password);

        return Promise.resolve({message: "OK"});
    }

}
