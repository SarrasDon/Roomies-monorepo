import { Document, DocumentQuery, Query } from 'mongoose';

export interface IRepository<T extends Document> {
  findAll(): DocumentQuery<T[], T, {}>;
  findById(id: Object | String | Number): DocumentQuery<T, T, {}>;
  findBy(key: keyof T): DocumentQuery<T, T, {}>;
  create(Dto: any): T;
  deleteById(id: Object | String | Number): DocumentQuery<T, T, {}>;
  deleteAll(): Query<any>;
}
