import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from 'src/database/entities/role.entity';

@Module({
    imports: [MikroOrmModule.forFeature([RoleEntity])],
    controllers: [],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule {}
