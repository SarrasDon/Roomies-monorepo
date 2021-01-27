import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';
import {
  createExpense,
  createExpenseFail,
  createExpenseSuccess,
  loadExpenses,
  loadExpensesSuccess,
  setExpensesCount,
  setExpensesReasons,
} from './expenses.actions';

export const expensesFeatureKey = 'expenses';
export interface ExpensesState extends EntityState<Expense> {
  count: number;
  reasons: ExpenseReason[];
  isLoading: boolean;
}

export const expensesAdapter = createEntityAdapter<Expense>({
  selectId: (user) => user._id,
  sortComparer: (a, b) =>
    new Date(a.spendAt).valueOf() > new Date(b.spendAt).valueOf()
      ? -1
      : new Date(a.spendAt).valueOf() < new Date(b.spendAt).valueOf()
        ? 1
        : 0,
});

const initialState = expensesAdapter.getInitialState({
  count: null,
  reasons: [],
  isLoading: false,
});

const _expenseReducer = createReducer<ExpensesState>(
  initialState,
  on(loadExpenses, (state, { }) => ({ ...state, isLoading: true })),
  on(loadExpensesSuccess, (state, { expenses }) =>
    expensesAdapter.upsertMany(expenses, { ...state, isLoading: false })
  ),
  on(setExpensesCount, (state, { count }) => ({ ...state, count })),
  on(setExpensesReasons, (state, { reasons }) => ({ ...state, reasons })),
  on(createExpense, (state, { amount, date, reason, clientId, user }) => {
    return expensesAdapter.addOne(
      {
        _id: clientId,
        spendAt: date,
        amount,
        reason,
        person: user,
        createdAt: new Date(),
      },
      state
    );
  }),
  on(createExpenseSuccess, (state, { expense, clientId }) => {
    return expensesAdapter.updateOne(
      { id: clientId, changes: { ...expense } },
      state
    ); //TODO: test the id update
  }),
  on(createExpenseFail, (state, { clientId }) => {
    return expensesAdapter.removeOne(clientId, state);
  })
);

export function expensesReducer(state: ExpensesState, action: Action) {
  return _expenseReducer(state, action);
}
