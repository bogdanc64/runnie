import { DataService } from "./data.service";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";

export class ApiClient {
    public user: UserService;
    public auth: AuthService;

    private readonly dataService: DataService;

    constructor(apiUrl?: string) {
        this.dataService = new DataService(apiUrl);
        this.user = new UserService(this.dataService);
        this.auth = new AuthService(this.dataService);
    }

    public getDataService() {
        return this.dataService;
    }
}
