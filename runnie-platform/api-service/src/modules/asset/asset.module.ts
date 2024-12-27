import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { PermissionModule } from '../permission/permission.module';
import { AssetEntity } from 'src/database/entities/asset.entity';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';

@Module({
    imports: [MikroOrmModule.forFeature([AssetEntity]), PermissionModule],
    controllers: [AssetController],
    providers: [AssetService],
    exports: [AssetService]
})
export class AssetModule {}
