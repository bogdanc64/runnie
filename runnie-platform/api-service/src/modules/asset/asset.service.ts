import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { AssetEntity } from 'src/database/entities/asset.entity';
import { BaseService } from '../base/base.service';
import { Asset } from 'runnie-common';
import { OrganizationEntity } from 'src/database/entities/organization.entity';

@Injectable()
export class AssetService extends BaseService<AssetEntity> {
    constructor(
        @InjectRepository(AssetEntity)
        public assetRepository: EntityRepository<AssetEntity>,
        public em: EntityManager
    ) {
        super(assetRepository, em);
    }

    async createAsset(asset: Asset): Promise<AssetEntity> {
        return this.create({
            name: asset.name,
            website: asset.website,
            organization: this.em.getReference(OrganizationEntity, asset.organization.id)
        });
    }
}
