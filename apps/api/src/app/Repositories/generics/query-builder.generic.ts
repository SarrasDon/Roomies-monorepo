import { Document, Query, DocumentQuery, Model } from 'mongoose';
import {
  SortingBuilder,
  PagingBuilder,
  SelectBuilder,
  PopulateBuilder,
  ConditionalBuilder,
  BaseBuilder,
} from '../query-builders';

export class QueryBuilder<T extends Document>
  implements
    BaseBuilder<T>,
    SortingBuilder<T>,
    PagingBuilder<T>,
    SelectBuilder<T>,
    PopulateBuilder<T>,
    ConditionalBuilder<T> {
  private query: Query<any> | DocumentQuery<T[], T, {}>;
  private _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  build() {
    return this.query;
  }

  sorting(key: keyof T, order: 1 | -1 | 0) {
    this.query = this.query.sort({ [key]: order });
    return this;
  }

  paging(index: number, limit: number) {
    this.query = this.query.skip(index).limit(limit);
    return this;
  }

  select(...keys: (keyof T)[]) {
    const joined = keys.map(k => k.toString()).join(' ');
    this.query = this.query.select(joined);
    return this;
  }

  populate<K>(path: keyof T, select: keyof K) {
    this.query = this.query.populate({ path, select });
    return this;
  }

  where(key: keyof T, value: any) {
    this.query = !value
      ? this._model.find()
      : this._model.where(key.toString(), value).find();
    return this;
  }
}
