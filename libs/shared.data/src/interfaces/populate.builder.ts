import { Document } from 'mongoose';

export interface PopulateBuilder<T extends Document> {
  populate<K>(path: keyof T, select: keyof K): PopulateBuilder<T>;
}
