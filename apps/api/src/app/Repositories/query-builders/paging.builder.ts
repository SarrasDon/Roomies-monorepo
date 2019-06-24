import { Document } from 'mongoose';

export interface PagingBuilder<T extends Document> {
  paging(index: number, limit: number): PagingBuilder<T>;
}
