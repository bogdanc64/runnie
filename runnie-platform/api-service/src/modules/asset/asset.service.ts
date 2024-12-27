import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { AssetEntity } from 'src/database/entities/asset.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class AssetService extends BaseService<AssetEntity> {
    constructor(
        @InjectRepository(AssetEntity)
        public assetRepository: EntityRepository<AssetEntity>,
        public em: EntityManager
    ) {
        super(assetRepository, em);
    }
}
