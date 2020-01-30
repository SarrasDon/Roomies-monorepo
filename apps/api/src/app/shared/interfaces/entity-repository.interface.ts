import { Document, DocumentQuery, Query, Model } from 'mongoose';

export interface Repository<T extends Document> {
  model: Model<T>;

  findAll(): DocumentQuery<T[], T, {}>;

  findById(id: Object | String | Number): DocumentQuery<T, T, {}>;

  findOneBy(key: Partial<T>): DocumentQuery<T, T, {}>;

  create(Dto: any): T;

  deleteById(id: Object | String | Number): DocumentQuery<T, T, {}>;

  count(): Query<number>;

  updateOne(
    _id: Object | String | Number,
    update: Partial<T>
  ): DocumentQuery<T, T, {}>;
}
