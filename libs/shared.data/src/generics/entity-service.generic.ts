import { FilterQuery } from 'mongoose';
import { EntityService, DocType, Entity } from '../interfaces';
import { EntityRepository } from './entity-repository.generic';

export class GenericService<T extends Entity, Resource extends Partial<T>>
  implements EntityService<T, Resource> {
  constructor(public repository: EntityRepository<T>) {}

  async get(): Promise<T[]> {
    return await this.repository.findAll().exec();
  }

  async getById(id: Object | String | Number): Promise<T> {
    return await this.repository.findById(id).exec();
  }

  async getOneBy(conditions: FilterQuery<DocType<T>>): Promise<T> {
    return await this.repository.findOneBy(conditions).then((result) => result);
  }

  async getCount(): Promise<number> {
    return await this.repository.count().exec();
  }

  async create(resource: Resource): Promise<T> {
    return await this.repository.create(resource).save();
  }

  async delete(id: Object | String | Number) {
    return await this.repository.deleteById(id).exec();
  }

  async update(id: string, update: Partial<DocType<T>>): Promise<any> {
    return await this.repository.updateOne(id, update).exec();
  }
}
