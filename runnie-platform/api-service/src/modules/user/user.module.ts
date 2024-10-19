import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PermissionModule } from '../permission/permission.module';

@Module({
    imports: [MikroOrmModule.forFeature([User]), PermissionModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
