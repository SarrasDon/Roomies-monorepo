import { Document, Query, DocumentQuery } from 'mongoose';

export interface BaseBuilder<T extends Document> {
  build(): Query<any> | DocumentQuery<T[], T, {}>;
}
