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
    reason: string;
    amount: number;
    date: Date;
    user: string;
    clientId: string;
  }>()
);

export const createExpenseSuccess = createAction(
  '[Create Expense Form] Create new Expense Success',
  props<{
    expense: Expense;
    clientId: string;
  }>()
);

export const createExpenseFail = createAction(
  '[Create Expense Form] Create new Expense Failed',
  props<{
    clientId: string;
    user: string;
    amount: number;
    reason: string;
    date: Date;
  }>()
);

export const deleteExpense = createAction(
  '[Expense Item] Delete Expense',
  props<{
    expense: Expense;
  }>()
);

export const deleteExpenseSuccess = createAction(
  '[Expense Effects] Delete Expense Success',
  props<{
    expense: Expense;
  }>()
);

export const deleteExpenseFail = createAction(
  '[Expense Effects] Delete Expense Fail'
);
