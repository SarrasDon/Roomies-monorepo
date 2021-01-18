import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Select } from '@ngxs/store';
import { User } from '@roomies/user.contracts';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { AuthState } from '../../auth/state';
import { ExpensesService } from '../services/expenses.service';
import { getTotals, totalsLoaded } from './totals.state';

@Injectable()
export class TotalsEffects {
  @Select(AuthState.currentUser) user$: Observable<User>;

  loadMovies$ = createEffect(() => this.actions$.pipe(
    ofType(getTotals),
    switchMap(() => this.expensesService.getTotals()
      .pipe(
        withLatestFrom(this.user$),
        map(([totals,user]) => totalsLoaded({totals, userId: user._id})),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private expensesService: ExpensesService
  ) {}
}
