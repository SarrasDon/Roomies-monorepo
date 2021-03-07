import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AuthState, getCurrentUser } from '../../auth/store';
import { ExpensesService } from '../services/expenses.service';
import { getTotals, getTotalsForMonth, totalsLoaded } from './totals.actions';

@Injectable()
export class TotalsEffects {
  user$ = this.store.pipe(select(getCurrentUser));

  loadTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTotals),
      switchMap(() =>
        this.expensesService.getTotals().pipe(
          withLatestFrom(this.user$),
          map(([totals, user]) => totalsLoaded({ totals, userId: user._id })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  loadTotalsForMonth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTotalsForMonth),
      switchMap(({ month, year }) =>
        this.expensesService.getTotalsForMonth({ month, year }).pipe(
          withLatestFrom(this.user$),
          map(([totals, user]) => totalsLoaded({ totals, userId: user._id })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private store: Store<AuthState>,
    private actions$: Actions,
    private expensesService: ExpensesService
  ) { }
}
