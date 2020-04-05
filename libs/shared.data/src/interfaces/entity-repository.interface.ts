import { Document, DocumentQuery, Query, Model } from 'mongoose';
import { DocType } from './document.type';

export interface Repository<T, D extends DocType<T>> {
  model: Model<D>;

  findAll(): DocumentQuery<D[], D, {}>;

  findById(id: Object | String | Number): DocumentQuery<D, D, {}>;

  findOneBy(key: Partial<T>): DocumentQuery<D, D, {}>;

  create(Dto: any): D;

  deleteById(id: Object | String | Number): DocumentQuery<D, D, {}>;

  count(): Query<number>;

  updateOne(
    _id: Object | String | Number,
    update: Partial<T>
  ): DocumentQuery<D, D, {}>;

  upsertOne(conditions: any, update: Partial<T>): Query<D>;
}
