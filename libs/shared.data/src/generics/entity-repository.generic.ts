import { Injectable } from '@nestjs/common';
import { DocumentQuery, Model, Query } from 'mongoose';
import { Repository, Entity } from '../interfaces';
import { DocType } from '../interfaces/document.type';

@Injectable()
export class EntityRepository<T extends Entity>
  implements Repository<T, DocType<T>> {
  constructor(public readonly model: Model<DocType<T>>) {}

  findAll(): DocumentQuery<DocType<T>[], DocType<T>, {}> {
    return this.model.find();
  }

  findById(
    id: Object | String | Number
  ): DocumentQuery<DocType<T>, DocType<T>, {}> {
    return this.model.findById(id);
  }

  findOneBy(
    conditions: Partial<DocType<T>>
  ): DocumentQuery<DocType<T>, DocType<T>, {}> {
    return this.model.findOne(conditions);
  }

  count() {
    return this.model.countDocuments();
  }

  create(Dto: any): DocType<T> {
    return new this.model({ ...Dto });
  }

  deleteById(
    id: Object | String | Number
  ): DocumentQuery<DocType<T>, DocType<T>, {}> {
    return this.model.findByIdAndDelete(id);
  }

  updateOne(_id: any, update: any): DocumentQuery<DocType<T>, DocType<T>, {}> {
    return this.model.findOneAndUpdate({ _id }, update, {
      new: true,
      useFindAndModify: false
    } as any);
  }

  upsertOne(conditions: any, update: any): Query<DocType<T>> {
    return this.model.updateOne(
      conditions,
      { ...update },
      { new: true, upsert: true }
    );
  }
}
