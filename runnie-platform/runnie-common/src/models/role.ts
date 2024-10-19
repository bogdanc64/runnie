import { Model } from "./model";
import { Permission } from "./permission";

export enum UserRoles {
    Admin = "admin",
    OrganizationAdmin = "organization_admin",
    User = "user"
}

export interface Role extends Model {
    name: string;
    description?: string;
    permissions: Permission[];
}