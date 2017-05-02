import {Route, Post, Security, Request, Body} from "tsoa";
import {Singleton, Inject} from "../util/ioc";
import {ISecurityRequest} from "../security";
import GenericResponse from "../response/generic-response";
import {AccountService} from "../service/account-service";
import {Account} from "../db/entity/account";

interface IFriendRequest {
    id: number;
}

@Route("friend")
@Singleton(FriendController)
export class FriendController {

    private accountService: AccountService;

    constructor(@Inject(AccountService) accountService: AccountService) {
        this.accountService = accountService;
    }

    @Post("request")
    @Security("jwt")
    public async sendRequest(@Request() request: ISecurityRequest,
                             @Body() friendRequest: IFriendRequest): Promise<GenericResponse> {

        const account: Account = await this.accountService.findOneById(request.user.id);
        const friend: Account = await this.accountService.findOneById(friendRequest.id);

        console.log(account, friend);

        return Promise.resolve(null);
    }

}
