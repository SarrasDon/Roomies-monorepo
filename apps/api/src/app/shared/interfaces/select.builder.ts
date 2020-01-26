import { Document } from 'mongoose';

export interface SelectBuilder<T extends Document> {
  select(...keys: (keyof T)[]): SelectBuilder<T>;
}
