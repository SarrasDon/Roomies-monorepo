import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
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
export class ExpensesState {
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
