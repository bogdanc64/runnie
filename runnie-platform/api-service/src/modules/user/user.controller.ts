import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PermissionAction, User } from 'runnie-common';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get()
    @RequirePermission("users", PermissionAction.View)
    getUsers() {
        return this.userService.getUsers();
    }

    @Patch('change-password')
    patchChangePassword(@CurrentUser() user: User, @Body() body: string): Promise<boolean> {
        // TODO: Implement this
        return new Promise(() => true);
    }
}
