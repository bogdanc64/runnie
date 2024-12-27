import { Model } from "./model";
import { Organization } from "./organization";
import { Test } from "./test";

export interface Asset extends Model {
    name: string;
    website: string;
    tests: Test[];
    organization: Organization;
}