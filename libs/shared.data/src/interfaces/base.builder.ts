import { Document, Query } from 'mongoose';
import { DocType } from './document.type';

export interface BaseBuilder<T extends Document> {
  build(): Query<T, DocType<T>>;
}
