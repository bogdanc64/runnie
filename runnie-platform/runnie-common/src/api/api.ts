import { DataService } from "./data.service";
import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { AssetService } from "./asset.service";

export class ApiClient {
    public user: UserService;
    public auth: AuthService;
    public assets: AssetService;
    private readonly dataService: DataService;

    constructor(apiUrl?: string) {
        this.dataService = new DataService(apiUrl);
        this.user = new UserService(this.dataService);
        this.auth = new AuthService(this.dataService);
        this.assets = new AssetService(this.dataService);
    }
}
