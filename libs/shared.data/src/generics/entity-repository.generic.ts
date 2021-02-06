import { Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { Repository, Entity } from '../interfaces';
import { DocType } from '../interfaces/document.type';

@Injectable()
export class EntityRepository<T extends Entity>
  implements Repository<T, DocType<T>> {
  constructor(public readonly model: Model<DocType<T>>) {}

  findAll() {
    return this.model.find();
  }

  findById(id: Object | String | Number) {
    return this.model.findById(id);
  }

  findOneBy(conditions: FilterQuery<DocType<T>>) {
    return this.model.findOne(conditions);
  }

  count() {
    return this.model.countDocuments();
  }

  create(Dto: any): DocType<T> {
    return new this.model({ ...Dto });
  }

  deleteById(id: Object | String | Number) {
    return this.model.findByIdAndDelete(id);
  }

  updateOne(_id: any, update: any) {
    return this.model.findOneAndUpdate({ _id }, update, {
      new: true,
      useFindAndModify: false,
    });
  }

  upsertOne(conditions: any, update: any) {
    return this.model.updateOne(
      conditions,
      { ...update },
      { new: true, upsert: true }
    );
  }
}
