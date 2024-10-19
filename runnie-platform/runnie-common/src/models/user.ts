import { Model } from "./model";

export enum UserStatus {
    Active,
    Pending
}

export interface User extends Model {
    email: string;
    name: string;
    photo?: string;
    role: string;
    status: UserStatus
}