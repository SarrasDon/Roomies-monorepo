import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, createAction, props, on } from '@ngrx/store';
import { createExpense, createExpenseFail } from './expenses.actions';

export const monthlyExpenseFeatureKey = 'monthlyExpense';

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
    return monthlyExpensesAdapter.upsertMany(monthlyExpenses, state);
  }),
  on(createExpense, (state, { amount, reason }) => {
    const oldTotal = state.entities[reason._id] || { total: 0 };
    return monthlyExpensesAdapter.upsertOne(
      {
        _id: reason._id,
        total: oldTotal.total + amount,
      },
      state
    );
  }),
  on(createExpenseFail, (state, { reason, amount }) => {
    const oldTotal = state.entities[reason._id] || { total: 0 };
    const newTotal = oldTotal.total - amount;
    if (newTotal <= 0) {
      return monthlyExpensesAdapter.removeOne(reason._id, state);
    }
    return monthlyExpensesAdapter.updateOne(
      { id: reason._id, changes: { total: newTotal } },
      state
    );
  })
);

export function monthlyExpensesReducer(
  state: MonthlyExpenseState,
  action: any
) {
  return _monthlyExpensesReducer(state, action);
}
