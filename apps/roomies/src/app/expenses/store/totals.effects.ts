import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthState } from '../../auth/store';
import { ExpensesService } from '../services/expenses.service';
import { getTotals, totalsLoaded } from './totals.actions';

@Injectable()
export class TotalsEffects {
  loadTotals$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTotals),
      switchMap(() =>
        this.expensesService.getTotals().pipe(
          map((totals) => totalsLoaded({ totals })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private expensesService: ExpensesService
  ) {}
}
