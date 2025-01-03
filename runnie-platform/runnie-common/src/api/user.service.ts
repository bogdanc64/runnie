import { BaseService } from "./base.service";
import { User } from "../models/user";
import { DataService } from "./data.service";

export class UserService extends BaseService<User> {
    constructor(readonly dataService: DataService) {
        super("/users", dataService);
    }
}