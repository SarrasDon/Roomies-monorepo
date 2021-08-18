import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ExpensesService } from '../services/expenses.service';
import {
  loadMonthlyExpenses,
  monthlyExpenseLoaded,
} from './monthlyExpenses.reducer';

@Injectable()
export class MonthlyExpensesEffects {
  loadMonthlyExpensess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMonthlyExpenses),
      switchMap(({ month, year }) =>
        this.expensesService.getMonthlyExpenses({ month, year }).pipe(
          map((monthlyExpenses) => monthlyExpenseLoaded({ monthlyExpenses })),
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
