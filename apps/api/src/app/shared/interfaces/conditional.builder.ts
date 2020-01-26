import { Document } from 'mongoose';

export interface ConditionalBuilder<T extends Document> {
  where(key: keyof T, value: any): ConditionalBuilder<T>;
}
