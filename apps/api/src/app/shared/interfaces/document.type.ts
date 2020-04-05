import { Document } from 'mongoose';

export type DocType<T> = T & Document;
