import { Document } from 'mongoose';

export interface SortingBuilder<T extends Document> {
  sorting(key: keyof T, order: 1 | -1 | 0): SortingBuilder<T>;
}
