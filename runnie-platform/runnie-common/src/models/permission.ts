import { Model } from "./model";

export enum PermissionAction {
    View = "view",
    Create = "create",
    Update = "update",
    Delete = "delete",
}

export enum PermissionResource {
    Tests = "tests"
}

export interface Permission extends Model {
    resource: PermissionResource;
    action: PermissionAction;
}