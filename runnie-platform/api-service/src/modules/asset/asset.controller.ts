import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
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

    @Post("create")
    @RequirePermission("assets", PermissionAction.Create)
    async postCreateAsset(@Body() asset: Asset) {
        return this.assetService.createAsset(asset);
    }

    @Put("update")
    @RequirePermission("assets", PermissionAction.Update)
    async putUpdateAsset(@Body() asset: Asset) {
        return this.assetService.update(asset.id, asset as AssetEntity);
    }

    @Delete(':id')
    @RequirePermission("assets", PermissionAction.Delete)
    async delete(@Param('id') id: number): Promise<void> {
        return this.assetService.delete(id);
    }
}