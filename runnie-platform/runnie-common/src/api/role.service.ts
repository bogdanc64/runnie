import { BaseService } from "./base.service";
import { Role } from "../models/role";
import { DataService } from "./data.service";

export class RoleService extends BaseService<Role> {
    constructor(readonly dataService: DataService) {
        super("/roles", "roles", dataService);
    }
}