export interface Dictionary<T extends { _id: string }> {
  [_id: string]: T;
}
