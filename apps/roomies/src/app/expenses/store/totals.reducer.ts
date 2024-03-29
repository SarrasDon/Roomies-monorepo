import { createReducer, on } from '@ngrx/store';
import { Total } from '../../shared/models';
import {
  createExpense,
  createExpenseFail,
  deleteExpenseSuccess,
} from './expenses.actions';
import { totalsLoaded } from './totals.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';

export const totalsFeatureKey = 'totals';

export interface TotalState extends EntityState<Total> {}

export const totalsAdapter = createEntityAdapter({
  selectId: (total: Total) => total._id,
});

const initialState: TotalState = totalsAdapter.getInitialState();

const _totalsReducer = createReducer(
  initialState,
  on(totalsLoaded, (state, { totals }) => {
    return totalsAdapter.upsertMany(totals, state);
  }),
  on(createExpense, (state, { user, amount }) => {
    if (!state.entities[user]) {
      return state;
    }
    const userTotalAmount = state.entities[user].total ?? 0;
    return totalsAdapter.updateOne(
      {
        id: user,
        changes: {
          total: userTotalAmount + amount,
        },
      },
      state
    );
  }),
  on(createExpenseFail, (state, { user, amount }) => {
    if (!state.entities[user]) {
      return state;
    }
    const userTotalAmount = state.entities[user].total ?? 0;

    return totalsAdapter.updateOne(
      {
        id: user,
        changes: {
          total: Math.max(userTotalAmount - amount, 0),
        },
      },
      state
    );
  }),
  on(deleteExpenseSuccess, (state, { expense }) => {
    const { person, amount } = expense;
    if (!state.entities[person as any]) {
      return state;
    }
    const userTotalAmount = state.entities[person as any].total ?? 0;

    return totalsAdapter.updateOne(
      {
        id: person as any,
        changes: {
          total: Math.max(userTotalAmount - amount, 0),
        },
      },
      state
    );
  })
);

export function totalsReducer(state: TotalState, action: any) {
  return _totalsReducer(state, action);
}
