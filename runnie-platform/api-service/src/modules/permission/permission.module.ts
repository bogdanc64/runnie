import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permission } from 'src/database/entities/permission.entity';

@Module({
    imports: [MikroOrmModule.forFeature([Permission])],
    controllers: [],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule {}
