import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'runnie-common';
import { PermissionService } from 'src/modules/permission/permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly permissionService: PermissionService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return true;
        const requiredPermission = this.reflector.get<string | null>('requiredPermission', context.getHandler());
        const [resource, action] = requiredPermission?.split(':') || [];
        if (!resource || !action) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user.role === UserRoles.Admin) {
            return true;
        }

        const userPermissions = await this.permissionService.getPermissionsByRoleName(user.role);
        return userPermissions.some(permission => permission.resource === resource && permission.action === action);
    }
}