import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from 'src/database/entities/role.entity';

@Module({
    imports: [MikroOrmModule.forFeature([Role])],
    controllers: [],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule {}
