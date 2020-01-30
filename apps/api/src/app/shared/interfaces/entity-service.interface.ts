import { Document } from 'mongoose';
import { Repository } from '.';

export interface EntityService<
  T extends Document,
  Resource extends Partial<T>
> {
  repository: Repository<T>;

  get(): Promise<T[]>;

  getById(id: Object | String | Number): Promise<T>;

  getOneBy(conditions: Partial<T>): Promise<T>;

  getCount(): Promise<number>;

  create(resource: Resource): Promise<T>;

  delete(id: Object | String | Number): Promise<T>;

  update(id: string, update: Partial<T>): Promise<T>;
}
