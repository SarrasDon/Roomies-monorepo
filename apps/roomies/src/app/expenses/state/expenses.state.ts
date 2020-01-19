import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import { AuthState } from '../../auth/state/auth.state';
import { SnackbarService } from '../../core/services';
import '../../shared/extensions/array.extensions';
import { Dictionary } from '../../shared/interfaces/dictionary.interface';
import { Expense, ExpenseReason, Total, User } from '../../shared/models';
import { ExpensesService } from '../services';
import {
  CreateExpense,
  GetExpenseReasons,
  GetExpenses,
  GetTotals
} from './expenses.actions';

export interface ExpensesStateModel {
  expenseDictionary: Dictionary<Expense> | null;
  count: number;
  selectedItem: Expense | null;
  reasons: ExpenseReason[];
  sorted: boolean;
  totals: Total[];
  balance: number;
}

@State<ExpensesStateModel>({
  name: 'expenses',
  defaults: {
    expenseDictionary: null,
    count: null,
    selectedItem: null,
    sorted: true,
    reasons: [],
    totals: [],
    balance: 0
  }
})
export class ExpensesState {
  @Selector()
  public static selectedExpense(state: ExpensesStateModel): Expense | null {
    return state.selectedItem;
  }

  @Selector()
  public static expenseDictionary(state: ExpensesStateModel) {
    return state.expenseDictionary;
  }

  @Selector()
  public static expenses(state: ExpensesStateModel): Expense[] {
    if (!state.expenseDictionary) {
      return [];
    }

    return state.sorted
      ? Object.values(state.expenseDictionary)
      : Object.values(state.expenseDictionary).sortBySpendDate();
  }

  @Selector()
  public static currentCount({ expenseDictionary }: ExpensesStateModel) {
    return Object.keys(expenseDictionary).length;
  }

  @Selector()
  public static reasons(state: ExpensesStateModel) {
    return state.reasons;
  }

  @Selector()
  static totals(state: ExpensesStateModel) {
    return state.totals.map(t => ({ name: t.user.name, value: t.total }));
  }

  @Selector()
  static sum(state: ExpensesStateModel) {
    return calcTotal(state.totals);
  }

  @Selector()
  static balance(
    state: ExpensesStateModel
  ): { amount: number; sign: 'positive' | 'negative' | 'balanced' } {
    return {
      amount: Math.abs(state.balance),
      sign:
        state.balance > 0
          ? 'positive'
          : state.balance < 0
          ? 'negative'
          : 'balanced'
    };
  }

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
    const { expenseDictionary, count } = ctx.getState();
    const currentCount = this.store.selectSnapshot(ExpensesState.currentCount);

    if (count !== null && currentCount >= count) {
      return;
    }

    return this.expensesService.getExpenses(index, limit).pipe(
      tap(({ expenses, count }) =>
        ctx.patchState({
          expenseDictionary: {
            ...expenseDictionary,
            ...expenses.toDictionary()
          },
          count
        })
      )
    );
  }

  @Action(GetExpenseReasons)
  GetExpenseReasons(ctx: StateContext<ExpensesStateModel>) {
    return this.expensesService
      .getExpenseReasons()
      .pipe(tap(reasons => ctx.patchState({ sorted: true, reasons })));
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
      .createExpense(reason._id, amount, date, _id)
      .pipe(
        map((exp: Expense) => ({
          exp: { [exp._id]: { ...exp, person, reason } } as Dictionary<Expense>,
          totals: incrementUserTotal(ctx.getState().totals, exp, _id)
        })),
        tap(
          () => this.snackbarService.success('Record added!'),
          () => this.snackbarService.fail('Something went wrong.')
        ),
        tap(({ exp, totals }) =>
          ctx.patchState({
            sorted: false,
            expenseDictionary: {
              ...ctx.getState().expenseDictionary,
              ...exp
            },
            totals,
            balance: calcBalance(totals, person)
          })
        )
      );
  }

  @Action(GetTotals)
  GetTotals(ctx: StateContext<ExpensesStateModel>) {
    const user = this.store.selectSnapshot(AuthState.currentUser);

    if (!user) {
      return;
    }
    return this.expensesService.getTotals().pipe(
      map(totals => totals.sort((a, b) => (a.user._id === user._id ? -1 : 1))),
      tap(totals =>
        ctx.patchState({ totals, balance: calcBalance(totals, user) })
      )
    );
  }
}

const calcTotal = (totals: Total[]) =>
  totals.reduce((acc, cur) => acc + cur.total, 0);

const calcBalance = (totals: Total[], user: User) => {
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
