import { createAction, props } from '@ngrx/store';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';
import { User } from '@roomies/user.contracts';

export const loadExpenses = createAction(
  '[Expenses] Load Expenses',
  props<{ index: number; limit: number }>()
);

export const loadExpensesSuccess = createAction(
  '[Expenses] Load Expenses Success',
  props<{ expenses: Expense[] }>()
);

export const setExpensesCount = createAction(
  '[Expenses Resolver] Set Expenses Count',
  props<{ count: number }>()
);

export const setExpensesReasons = createAction(
  '[Expenses Resolver] Set Expenses Reasons',
  props<{ reasons: ExpenseReason[] }>()
);

export const createExpense = createAction(
  '[Create Expense Form] Create new Expense',
  props<{
    reason: ExpenseReason;
    amount: number;
    date: Date;
    user: User;
    clientId: string;
  }>()
);

export const createExpenseSuccess = createAction(
  '[Create Expense Form] Create new Expense Success',
  props<{ expense: Expense; clientId: string }>()
);

export const createExpenseFail = createAction(
  '[Create Expense Form] Create new Expense Failed',
  props<{ clientId: string; user: User; amount: number }>()
);
