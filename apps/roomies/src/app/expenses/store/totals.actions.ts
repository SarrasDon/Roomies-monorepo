import { createAction, props } from "@ngrx/store";
import { Total } from "../../shared/models";

export const getTotals = createAction('[Totals] Get Totals per User');
export const totalsLoaded = createAction(
  '[Totals] Totals loaded',
  props<{ totals: Total[]; userId: string }>()
);
export const incrementTotal = createAction(
  '[Totals] Increment Total',
  props<{ amount: number; userId: string }>()
);
