import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  tap,
  switchMap,
} from 'rxjs/operators';
import { AuthState, getCurrentUser, getUserEntities } from '../../auth/store';
import { SnackbarService } from '../../core/services/snackbar.service';
import { storeSnapshot } from '../../shared/utils';
import { DeleteConfirmationComponent } from '../components/delete-confirmation/delete-confirmation.component';
import { ExpensesService } from '../services/expenses.service';
import {
  createExpense,
  createExpenseFail,
  createExpenseSuccess,
  deleteExpense,
  deleteExpenseFail,
  deleteExpenseSuccess,
  loadExpenses,
  loadExpensesSuccess,
  preDeleteExpense,
  preDeleteExpenseFail,
  preDeleteExpenseSuccess,
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
            reason,
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
                  user: this.user._id,
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

  preDeleteExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(preDeleteExpense),
      map(({ expense }) => {
        const isCurrentUserExpense = expense.person === this.user._id;
        return isCurrentUserExpense
          ? preDeleteExpenseSuccess({ expense })
          : preDeleteExpenseFail({ expense });
      })
    )
  );

  deleteExpense$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteExpense),
      switchMap(({ expense }) => {
        return this.expensesService.delete(expense._id).pipe(
          map(() => deleteExpenseSuccess({ expense })),
          catchError(() => of(deleteExpenseFail()))
        );
      })
    )
  );

  deleteExpenseFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteExpenseFail),
        tap(() => {
          this.snackBarService.fail(`Expense wasn't deleted!`);
        })
      ),
    { dispatch: false }
  );

  preDeleteExpenseSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(preDeleteExpenseSuccess),
        tap(({ expense }) => {
          this.dialog.open(DeleteConfirmationComponent, {
            data: expense,
            minHeight: 300,
            maxHeight: '90vh',
            minWidth: 300,
            maxWidth: '90vw',
            panelClass: 'delete-expense-dialog',
          });
        })
      ),
    { dispatch: false }
  );

  preDeleteExpenseFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(preDeleteExpenseFail),
        tap(({ expense }) => {
          const user = this.users[expense.person];
          this.snackBarService.fail(`${user.name} payed for this!`);
        })
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private store: Store<AuthState>,
    private actions$: Actions,
    private expensesService: ExpensesService,
    private snackBarService: SnackbarService,
    private dialog: MatDialog
  ) {}
}
