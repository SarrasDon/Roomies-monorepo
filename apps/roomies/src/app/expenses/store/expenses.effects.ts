import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, mergeMap, tap } from 'rxjs/operators';
import { AuthState, getCurrentUser, getUserEntities } from '../../auth/store';
import { SnackbarService } from '../../core/services/snackbar.service';
import { storeSnapshot } from '../../shared/utils';
import { ExpensesService } from '../services/expenses.service';
import {
  createExpense,
  createExpenseFail,
  createExpenseSuccess,
  loadExpenses,
  loadExpensesSuccess,
} from './expenses.actions';
import { selectExpenseReasonsEntities } from './expenses.selectors';

@Injectable()
export class ExpensesEffects {
  get user() {
    return storeSnapshot(this.store, getCurrentUser);
  }

  get reasons() {
    return storeSnapshot(this.store, selectExpenseReasonsEntities);
  }

  get users() {
    return storeSnapshot(this.store, getUserEntities);
  }

  loadExpenses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExpenses),
      mergeMap(
        ({ limit, index }) =>
          this.expensesService
            .getExpenses(index, limit)
            .pipe(map((expenses) => loadExpensesSuccess({ expenses }))) //TODO: handle error
      )
    )
  );

  createExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createExpense),
      concatMap(({ reason, amount, date, clientId }) =>
        this.expensesService
          .create({
            reason: reason._id,
            amount,
            spendAt: date,
            person: this.user._id,
          })
          .pipe(
            map((expense) => {
              return createExpenseSuccess({
                expense,
                clientId,
              });
            }),
            catchError(() =>
              of(
                createExpenseFail({
                  clientId,
                  user: this.user,
                  amount,
                  reason,
                  date,
                })
              )
            )
          )
      )
    )
  );

  createExpenseFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createExpenseFail),
        tap(() => {
          this.snackBarService.fail('Something went wrong!');
        })
      ),
    { dispatch: false }
  );

  createExpenseSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createExpenseSuccess),
        map(({ expense }) => new Date(expense.spendAt)),
        tap((date) => {
          this.expensesService.invalidateCache({
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private store: Store<AuthState>,
    private actions$: Actions,
    private expensesService: ExpensesService,
    private snackBarService: SnackbarService
  ) {}
}
