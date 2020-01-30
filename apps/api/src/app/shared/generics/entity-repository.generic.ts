import { Injectable } from '@nestjs/common';
import { Document, DocumentQuery, Model } from 'mongoose';
import { Repository } from '../interfaces';

@Injectable()
export class EntityRepository<T extends Document> implements Repository<T> {
  constructor(public readonly model: Model<T>) {}

  findAll(): DocumentQuery<T[], T, {}> {
    return this.model.find();
  }

  findById(id: Object | String | Number): DocumentQuery<T, T, {}> {
    return this.model.findById(id);
  }

  findOneBy(conditions: Partial<T>): DocumentQuery<T, T, {}> {
    return this.model.findOne(conditions);
  }

  count() {
    return this.model.countDocuments();
  }

  create(Dto: any): T {
    return new this.model({ ...Dto });
  }

  deleteById(id: Object | String | Number): DocumentQuery<T, T, {}> {
    return this.model.findByIdAndDelete(id);
  }

  updateOne(_id: string, update: Partial<T>): DocumentQuery<T, T, {}> {
    return this.model.findOneAndUpdate({ _id }, update, {
      new: true,
      useFindAndModify: false
    } as any);
  }
}
