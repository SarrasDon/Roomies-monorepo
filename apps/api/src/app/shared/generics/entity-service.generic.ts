import { Document } from 'mongoose';
import { Repository, EntityService } from '../interfaces';

export class GenericService<T extends Document, Resource extends Partial<T>>
  implements EntityService<T, Resource> {
  constructor(public repository: Repository<T>) {}

  async get(): Promise<T[]> {
    return await this.repository.findAll().exec();
  }

  async getById(id: Object | String | Number): Promise<T> {
    return await this.repository.findById(id).exec();
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

  async update(id: string, update: Partial<T>): Promise<T> {
    return (await this.repository.updateOne(id, update)).save();
  }
}
