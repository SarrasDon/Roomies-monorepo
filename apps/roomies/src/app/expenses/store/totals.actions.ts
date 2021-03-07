import { createAction, props } from "@ngrx/store";
import { Total } from "../../shared/models";

export const getTotals = createAction('[Totals] Get Totals per User');
export const getTotalsForMonth = createAction(
  '[Totals] Get Totals per User for Month',
  props<{ month: number, year: number }>()
);

export const totalsLoaded = createAction(
  '[Totals] Totals loaded',
  props<{ totals: Total[]; userId: string }>()
);
