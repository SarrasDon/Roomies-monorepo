import { Query, Model, FilterQuery } from 'mongoose';
import { DocType } from './document.type';

export interface Repository<T, D extends DocType<T>> {
  model: Model<D>;

  findAll(): Query<D[], D>;

  findById(id: Object | String | Number): Query<DocType<T>, DocType<T>>;

  findOneBy(key: FilterQuery<DocType<T>>): Query<T | null, DocType<T>>;

  create(Dto: any): D;

  deleteById(id: Object | String | Number): Query<T, D>;

  count(): Query<number, D>;

  updateOne(_id: Object | String | Number, update: Partial<T>): Query<T, D>;

  upsertOne(conditions: any, update: Partial<T>): Query<any, D>;
}
