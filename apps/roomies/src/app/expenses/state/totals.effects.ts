import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AuthState, getCurrentUser } from '../../auth/state';
import { ExpensesService } from '../services/expenses.service';
import { getTotals, totalsLoaded } from './totals.state';

@Injectable()
export class TotalsEffects {
  user$ = this.store.pipe(select(getCurrentUser))

  loadMovies$ = createEffect(() => this.actions$.pipe(
    ofType(getTotals),
    switchMap(() => this.expensesService.getTotals()
      .pipe(
        withLatestFrom(this.user$),
        map(([totals, user]) => totalsLoaded({ totals, userId: user._id })),
        catchError(() => EMPTY)
      ))
  )
  );

  constructor(
    private store: Store<AuthState>,
    private actions$: Actions,
    private expensesService: ExpensesService
  ) { }
}
