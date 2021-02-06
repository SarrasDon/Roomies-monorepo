import { Repository } from './entity-repository.interface';
import { DocType } from './document.type';
import { FilterQuery } from 'mongoose';

export interface EntityService<T, Resource extends Partial<T>> {
  repository: Repository<T, DocType<T>>;

  get(): Promise<T[]>;

  getById(id: Object | String | Number): Promise<T>;

  getOneBy(conditions: FilterQuery<DocType<T>>): Promise<T>;

  getCount(): Promise<number>;

  create(resource: Resource): Promise<T>;

  delete(id: Object | String | Number): Promise<T>;

  update(id: string, update: Partial<T>): Promise<any>;
}
