import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { OrganizationEntity } from '../../database/entities/organization.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class OrganizationService extends BaseService<OrganizationEntity> {
  constructor(
    @InjectRepository(OrganizationEntity)
    public readonly repository: EntityRepository<OrganizationEntity>,
    public readonly em: EntityManager
  ) {
    super(repository, em);
  }
}