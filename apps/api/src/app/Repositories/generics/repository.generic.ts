import { Injectable } from '@nestjs/common';
import { Document, DocumentQuery, Model, Query } from 'mongoose';
import { IRepository } from '../interfaces';

@Injectable()
export class Repository<K extends Document> implements IRepository<K> {
  constructor(public readonly model: Model<K>) {}

  findAll(): DocumentQuery<K[], K, {}> {
    return this.model.find();
  }

  findById(id: Object | String | Number): DocumentQuery<K, K, {}> {
    return this.model.findById(id);
  }

  findBy(key: any): DocumentQuery<K, K, {}> {
    return this.model.findOne(key);
  }

  create(Dto: any): K {
    return new this.model({ ...Dto });
  }

  deleteById(id: Object | String | Number): DocumentQuery<K, K, {}> {
    return this.model.findByIdAndDelete(id);
  }

  deleteAll(): Query<any> {
    return this.model.deleteMany({});
  }

  updateOne(_id: string, update: Partial<K>): Query<any> {
    return this.model.updateOne({ _id }, { $set: update });
  }
}
