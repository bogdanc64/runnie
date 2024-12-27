import { Asset } from "../models/asset";
import { BaseService } from "./base.service";
import { DataService } from "./data.service";

export class AssetService extends BaseService<Asset> {
    constructor(readonly dataService: DataService) {
        super("/assets", "assets", dataService);
    }
}
