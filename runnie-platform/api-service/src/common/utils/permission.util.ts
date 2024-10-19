import { Permission } from "runnie-common";

export class PermissionUtil {
    static reducePermissionsByResource(permissions: Permission[]): { [key: string]: string[] } {
        return permissions?.reduce((acc, permission) => {
            const resource = permission.resource;
            if (!acc[resource]) {
                acc[resource] = [];
            }

            acc[resource].push(permission.action);
            return acc;
          }, {});
    }
}