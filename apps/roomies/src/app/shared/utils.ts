import { select, Selector, Store } from "@ngrx/store";
import { first } from "rxjs/operators";

export function toDictionary<T extends { _id: string }>(
  array: Array<T>
): { [_id: string]: T } {
  return array.reduce((acc, curr) => ({ ...acc, [curr._id]: curr }), {});
}

export function storeSnapshot<T, V>(store: Store<T>, selector: Selector<T, V>) {
  let storeSlice: V;
  store.pipe(select(selector), first()).subscribe(slice => storeSlice = slice);
  return storeSlice;
}
