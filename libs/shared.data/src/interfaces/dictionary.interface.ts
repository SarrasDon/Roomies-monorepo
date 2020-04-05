import { Entity } from './entity.interface';

export interface Dictionary<T extends Entity> {
  [_id: string]: T;
}
