import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { createExpense, createExpenseFail, createExpenseSuccess, loadExpenses, loadExpensesSuccess } from './expenses.actions';
import { AuthState, getCurrentUser } from '../../auth/state';
import { SnackbarService } from '../../core/services/snackbar.service';
import { storeSnapshot } from '../../shared/utils';
import { ExpensesService } from '../services/expenses.service';

@Injectable()
export class ExpensesEffects {
  get user() {
    return storeSnapshot(this.store, getCurrentUser)
  }

  loadExpenses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadExpenses),
      switchMap(({ limit, index }) =>
        this.expensesService.getExpenses(index, limit).pipe(
          map((expenses) => loadExpensesSuccess({ expenses })),
          // TODO: test scrolling
        ) //TODO: handle error
      )
    )
  );

  createExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createExpense),
      concatMap(({ reason, amount, date, clientId }) =>
        this.expensesService.create({ reason: reason._id, amount, spendAt: date, person: this.user._id }).pipe(
          map(expense => createExpenseSuccess({ expense, clientId: 'dasdad' })),
          catchError(() => of(createExpenseFail({ clientId })))
        ))))

  createExpenseSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createExpenseSuccess),
      tap(() => { this.snackBarService.success('Expense Added!') })
    ), { dispatch: false });

  createExpenseFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createExpenseFail),
      tap(() => { this.snackBarService.fail('Something went wrong!') })
    ), { dispatch: false })

  constructor(
    private store: Store<AuthState>,
    private actions$: Actions,
    private expensesService: ExpensesService,
    private snackBarService: SnackbarService
  ) { }
}
