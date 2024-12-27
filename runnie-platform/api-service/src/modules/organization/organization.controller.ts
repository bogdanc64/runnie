import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationEntity } from '../../database/entities/organization.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async list(): Promise<OrganizationEntity[]> {
    return this.organizationService.list();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<OrganizationEntity> {
    return this.organizationService.findOne(id);
  }

  @Post("upsert")
  async upsert(@Body() organization: Partial<OrganizationEntity>): Promise<OrganizationEntity> {
    return this.organizationService.upsert(organization);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.organizationService.delete(id);
  }
}