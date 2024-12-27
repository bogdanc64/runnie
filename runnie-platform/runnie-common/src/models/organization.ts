import { Asset } from "./asset";
import { Model } from "./model";
import { User } from "./user";

export interface Organization extends Model {
    name: string;
    description: string;
    users: User[];
    assets: Asset[];
}