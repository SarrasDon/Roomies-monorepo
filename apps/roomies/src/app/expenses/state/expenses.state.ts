import { Injectable } from '@angular/core';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createAction, createReducer, props, Store } from '@ngrx/store';
import { Action, State, StateContext } from '@ngxs/store';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';
import { Dictionary } from '@roomies/shared.data';
import { map, tap } from 'rxjs/operators';
import { getCurrentUser } from '../../auth/state';
import { AuthState } from '../../auth/state/auth.state';
import { SnackbarService } from '../../core/services';
import { storeSnapshot, toDictionary } from '../../shared/utils';
import { ExpensesService } from '../services';
import {
  CreateExpense,
  GetExpenses,
  SetExpensesCount,
  SetExpensesReasons,
} from './expenses.actions';

export interface ExpensesState extends EntityState<Expense> {
  selectedItem: Expense | null;
  count: number;
  reasons: ExpenseReason[];
  sorted: boolean;
  lastCall: boolean;
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
  selectedItem: null,
  sorted: true,
  reasons: [],
  lastCall: false,
  isLoading: false,
});

export const getExpenses = createAction(
  '[Expenses] Get Expenses',
  props<{ index: number; limit: number }>()
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
  props<{ reason: ExpenseReason; amount: number; date: Date }>()
);

const _expenseReducer = createReducer(initialState);
export interface ExpensesStateModel {
  expenseDictionary: Dictionary<Expense> | null;
  count: number;
  selectedItem: Expense | null;
  reasons: ExpenseReason[];
  sorted: boolean;
  lastCall: boolean;
  isLoading: boolean;
}

@State<ExpensesStateModel>({
  name: 'expenses',
  defaults: {
    expenseDictionary: null,
    count: null,
    selectedItem: null,
    sorted: true,
    reasons: [],
    lastCall: false,
    isLoading: true,
  },
})
@Injectable()
export class NgxsExpensesState {
  constructor(
    private store: Store<AuthState>,
    private expensesService: ExpensesService,
    private snackbarService: SnackbarService
  ) {}

  get user() {
    return storeSnapshot(this.store, getCurrentUser);
  }

  @Action(GetExpenses)
  getExpenses(
    ctx: StateContext<ExpensesStateModel>,
    { index, limit }: GetExpenses
  ) {
    if (!this.user) {
      return;
    }
    const { expenseDictionary, count, lastCall } = ctx.getState();

    if (lastCall) {
      return;
    }
    ctx.patchState({ lastCall: count !== null && index + limit >= count });

    return this.expensesService.getExpenses(index, limit).pipe(
      tap((expenses) =>
        ctx.patchState({
          expenseDictionary: {
            ...expenseDictionary,
            ...toDictionary(expenses),
          },
          sorted: true,
          isLoading: false,
        })
      )
    );
  }

  @Action(SetExpensesCount)
  setExpensesCount(
    ctx: StateContext<ExpensesStateModel>,
    { count }: SetExpensesCount
  ) {
    ctx.patchState({ count });
  }

  @Action(SetExpensesReasons)
  setExpenseReasons(
    ctx: StateContext<ExpensesStateModel>,
    { reasons }: SetExpensesReasons
  ) {
    ctx.patchState({ reasons });
  }

  @Action(CreateExpense)
  createExpense(
    ctx: StateContext<ExpensesStateModel>,
    { reason, amount, date }: CreateExpense
  ) {
    if (!this.user) {
      return;
    }
    const { _id } = this.user;
    return this.expensesService
      .create({ reason: reason._id, amount, spendAt: date, person: _id })
      .pipe(
        map((exp: Expense) => ({
          exp: {
            [exp._id]: { ...exp, person: this.user, reason },
          } as Dictionary<Expense>,
        })),
        tap(
          () => this.snackbarService.success('Record added!'),
          () => this.snackbarService.fail('Something went wrong.')
        ),
        tap(({ exp }) =>
          ctx.patchState({
            sorted: false,
            expenseDictionary: {
              ...ctx.getState().expenseDictionary,
              ...exp,
            },
          })
        )
      );
  }
}
