import { EntityManager, EntityRepository, FilterQuery, FindAllOptions } from "@mikro-orm/core";
import { BaseEntity } from "src/database/entities/base.entity";

export class BaseService<Entity extends BaseEntity> {
    constructor(
        public repository: EntityRepository<Entity>,
        public em: EntityManager
    ) { }

    async list(): Promise<Entity[]> {
        const options: FindAllOptions<Entity> = {
            where: { deleted: false } as any,
            populate: ['*'] as any
        };
        return this.repository.findAll(options);
    }

    async findOne(id: number): Promise<Entity | null> {
        return this.repository.findOne({ 
            id: { $eq: id },
            deleted: { $eq: false }
        } as any, {
            populate: ['*'] as any
        });
    }
    

    async findOneWithPopulate(options: FilterQuery<Entity>): Promise<Entity | null> {
        return this.repository.findOne(options, {
            populate: ['*'] as any
        });
    }

    async delete(id: number): Promise<void> {
        const entity = await this.findOne(id);
        if (!entity) {
            return;
        }

        entity.deleted = true;
        await this.em.persistAndFlush(entity);
    }

    async create(data: Partial<Entity>): Promise<Entity> {
        const entity = this.repository.create(data, { partial: true });
        await this.em.persistAndFlush(entity);
        return entity;
    }

    async update(id: number, data: Partial<Entity>): Promise<Entity> {
        const entity = await this.findOne(id);
        if (!entity) {
            return null;
        }
        
        Object.assign(entity, data);
        await this.em.persistAndFlush(entity);
        return entity;
    }

    async upsert(data: Partial<Entity>): Promise<Entity> {
        const entity = this.repository.upsert(data);
        await this.em.flush();
        return entity;
    }
}
