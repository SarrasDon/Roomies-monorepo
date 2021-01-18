import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { AuthState } from '../../auth/state/auth.state';
import { SnackbarService } from '../../core/services';
import { Dictionary } from '@roomies/shared.data';
import { ExpensesService } from '../services';
import {
  CreateExpense,
  GetExpenses,
  GetTotals,
  SetExpensesCount,
  SetExpensesReasons as SetExpenseReasons
} from './expenses.actions';
import { toDictionary } from '../../shared/utils';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';
import { User } from '@roomies/user.contracts';
import { Total } from '../../shared/models';

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
    isLoading: true
  }
})
@Injectable()
export class ExpensesState {
  constructor(
    private store: Store,
    private expensesService: ExpensesService,
    private snackbarService: SnackbarService
  ) {}

  @Action(GetExpenses)
  getExpenses(
    ctx: StateContext<ExpensesStateModel>,
    { index, limit }: GetExpenses
  ) {
    const user = this.store.selectSnapshot(AuthState.currentUser);
    if (!user) {
      return;
    }
    const { expenseDictionary, count, lastCall } = ctx.getState();

    if (lastCall) {
      return;
    }
    ctx.patchState({ lastCall: count !== null && index + limit >= count });

    return this.expensesService.getExpenses(index, limit).pipe(
      tap(expenses =>
        ctx.patchState({
          expenseDictionary: {
            ...expenseDictionary,
            ...toDictionary(expenses)
          },
          sorted: true,
          isLoading: false
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

  @Action(SetExpenseReasons)
  setExpenseReasons(
    ctx: StateContext<ExpensesStateModel>,
    { reasons }: SetExpenseReasons
  ) {
    ctx.patchState({ reasons });
  }

  @Action(CreateExpense)
  createExpense(
    ctx: StateContext<ExpensesStateModel>,
    { reason, amount, date }: CreateExpense
  ) {
    const person = this.store.selectSnapshot(AuthState.currentUser);

    if (!person) {
      return;
    }
    const { _id } = person;
    return this.expensesService
      .create({ reason: reason._id, amount, spendAt: date, person: _id })
      .pipe(
        map((exp: Expense) => ({
          exp: { [exp._id]: { ...exp, person, reason } } as Dictionary<Expense>,
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
              ...exp
            },
          })
        )
      );
  }
}

export const calcTotal = (totals: Total[]) =>
  totals.reduce((acc, cur) => acc + cur.total, 0);

export const calcBalance = (totals: Total[], user: User) => {
  const count = (totals[0] || { count: 0 }).count;
  if (!count) {
    return 0;
  }
  const sum = calcTotal(totals);
  const userTotal = (totals.find(t => t.user._id === user._id) || { total: 0 })
    .total;
  return sum / count - userTotal;
};

const incrementUserTotal = (
  totals: Total[],
  expense: Expense,
  userId: string
) => {
  const cloned = JSON.parse(JSON.stringify(totals)) as Total[];
  const userTotal = cloned.find(t => t.user._id === userId);
  if (userTotal) {
    userTotal.total += expense.amount;
  }
  return cloned;
};
