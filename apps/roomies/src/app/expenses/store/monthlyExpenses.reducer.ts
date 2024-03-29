import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createAction, createReducer, on, props } from '@ngrx/store';
import {
  createExpense,
  createExpenseFail,
  deleteExpenseSuccess,
} from './expenses.actions';

export const monthlyExpenseFeatureKey = 'monthlyExpenses';

export interface MonthlyExpense {
  _id: string;
  total: number;
}

export interface MonthlyExpenseState extends EntityState<MonthlyExpense> {
  currentMonth: { month: number; year: number };
}

export const monthlyExpensesAdapter = createEntityAdapter({
  selectId: (monthlyExpense: MonthlyExpense) => monthlyExpense._id,
  sortComparer: (a, b) => b.total - a.total,
});

const initialState: MonthlyExpenseState = monthlyExpensesAdapter.getInitialState(
  {
    currentMonth: {
      month: new Date().getMonth(),
      year: new Date().getUTCFullYear(),
    },
  }
);

export const loadMonthlyExpenses = createAction(
  '[Expenses list] Load Monthly expenses',
  props<{ month: number; year: number }>()
);

export const monthlyExpenseLoaded = createAction(
  '[Monthly Expenses Effects] Monthly expenses loaded',
  props<{ monthlyExpenses: MonthlyExpense[] }>()
);

const _monthlyExpensesReducer = createReducer(
  initialState,
  on(loadMonthlyExpenses, (state, { month, year }) => {
    return { ...state, currentMonth: { month, year } };
  }),
  on(monthlyExpenseLoaded, (state, { monthlyExpenses }) => {
    return monthlyExpensesAdapter.addMany(
      monthlyExpenses,
      monthlyExpensesAdapter.removeAll(state)
    );
  }),
  on(createExpense, (state, { amount, reason, date }) => {
    const newMonth = date.getUTCMonth();
    const newYear = date.getUTCFullYear();
    const { month, year } = state.currentMonth;

    if (newMonth === month && newYear === year) {
      const oldTotal = state.entities[reason] || { total: 0 };
      return monthlyExpensesAdapter.upsertOne(
        {
          _id: reason,
          total: oldTotal.total + amount,
        },
        state
      );
    }

    return state;
  }),
  on(createExpenseFail, (state, { reason, amount, date }) => {
    const newMonth = date.getUTCMonth();
    const newYear = date.getUTCFullYear();
    const { month, year } = state.currentMonth;

    if (newMonth === month && newYear === year) {
      const oldTotal = state.entities[reason] || { total: 0 };
      const newTotal = oldTotal.total - amount;
      if (newTotal <= 0) {
        return monthlyExpensesAdapter.removeOne(reason, state);
      }
      return monthlyExpensesAdapter.updateOne(
        { id: reason, changes: { total: newTotal } },
        state
      );
    }

    return state;
  }),
  on(deleteExpenseSuccess, (state, { expense }) => {
    const { spendAt: date, reason, amount } = expense;

    const newMonth = new Date(date).getUTCMonth();
    const newYear = new Date(date).getUTCFullYear();
    const { month, year } = state.currentMonth;

    if (newMonth === month && newYear === year) {
      const oldTotal = state.entities[reason] || { total: 0 };
      const newTotal = oldTotal.total - amount;
      if (newTotal <= 0) {
        return monthlyExpensesAdapter.removeOne(reason as any, state);
      }
      return monthlyExpensesAdapter.updateOne(
        { id: reason as any, changes: { total: newTotal } },
        state
      );
    }

    return state;
  })
);

export function monthlyExpensesReducer(
  state: MonthlyExpenseState,
  action: any
) {
  return _monthlyExpensesReducer(state, action);
}
