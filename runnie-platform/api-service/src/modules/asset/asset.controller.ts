import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Asset, PermissionAction } from 'runnie-common';
import { RequirePermission } from 'src/common/decorators/require-permission.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { AssetService } from './asset.service';
import { AssetEntity } from 'src/database/entities/asset.entity';

@Controller("assets")
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AssetController {
    constructor(
        private readonly assetService: AssetService
    ) {}

    @Get()
    @RequirePermission("assets", PermissionAction.View)
    getAssets() {
        return this.assetService.list();
    }

    @Post("upsert")
    @RequirePermission("assets", PermissionAction.Create)
    postUpsertAsset(@Body() asset: Asset) {
        return this.assetService.upsert(asset as Partial<AssetEntity>);
    }
}
