import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionEntity } from 'src/database/entities/permission.entity';

@Module({
    imports: [MikroOrmModule.forFeature([PermissionEntity])],
    controllers: [],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule {}
