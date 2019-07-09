import {
  Action,
  Selector,
  State,
  StateContext,
  Store,
  UpdateState
} from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import '../../shared/extensions/array.extensions';
import { Dictionary } from '../../shared/interfaces/dictionary.interface';
import { ExpensesService } from '../services';
import {
  GetExpenses,
  GetExpenseReasons,
  CreateExpense,
  GetTotals
} from './expenses.actions';
import { AuthState } from '../../auth/state/auth.state';
import { Total, Expense, ExpenseReason, User } from '../../shared/models';
import { SnackbarService } from '../../core/services';

export interface ExpensesStateModel {
  expenseDictionary: Dictionary<Expense> | null;
  selectedItem: Expense | null;
  reasons: ExpenseReason[];
  sorted: boolean;
  totals: Total[];
  balance: number;
  pendingSave: boolean;
}

@State<ExpensesStateModel>({
  name: 'expenses',
  defaults: {
    expenseDictionary: null,
    selectedItem: null,
    sorted: true,
    reasons: [],
    totals: [],
    balance: 0,
    pendingSave: false
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

  @Selector()
  static pendingSave(state: ExpensesStateModel) {
    return state.pendingSave;
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
    const { expenseDictionary } = ctx.getState();

    return this.expensesService.getExpenses(index, limit).pipe(
      map(expenses => expenses.toDictionary()),
      tap(dict =>
        ctx.patchState({
          expenseDictionary: { ...expenseDictionary, ...dict }
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
    const user = this.store.selectSnapshot(AuthState.currentUser);

    if (!user) {
      return;
    }
    ctx.patchState({ pendingSave: true });
    return this.expensesService
      .createExpense(reason._id, amount, date, user._id)
      .pipe(
        map((exp: Expense) => ({
          exp: { [exp._id]: { ...exp, person: user, reason } } as Dictionary<
            Expense
          >,
          totals: incrementUserTotal(ctx.getState().totals, exp, user._id)
        })),
        tap(
          () => this.snackbarService.success('Record added!'),
          () => this.snackbarService.fail('Something went wrong.')
        ),
        tap(
          ({ exp, totals }) =>
            ctx.patchState({
              pendingSave: false,
              sorted: false,
              expenseDictionary: {
                ...ctx.getState().expenseDictionary,
                ...exp
              },
              totals,
              balance: calcBalance(totals, user)
            }),
          () => ctx.patchState({ pendingSave: false })
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
