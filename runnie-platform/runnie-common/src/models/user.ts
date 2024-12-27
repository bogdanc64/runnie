import { Model } from "./model";
import { Organization } from "./organization";

export enum UserStatus {
    Active,
    Pending
}

export interface User extends Model {
    email: string;
    name: string;
    photo?: string;
    role: string;
    status: UserStatus;
    organization: Organization;
}