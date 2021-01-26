import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';
import {
  createExpense,
  createExpenseFail,
  createExpenseSuccess,
  loadExpensesSuccess,
  setExpensesCount,
  setExpensesReasons,
} from './expenses.actions';

export const expensesFeatureKey = 'expenses';
export interface ExpensesState extends EntityState<Expense> {
  selectedItem: Expense | null;
  count: number;
  reasons: ExpenseReason[];
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
  reasons: [],
  lastCall: false,
  isLoading: false,
});

const _expenseReducer = createReducer<ExpensesState>(
  initialState,
  on(loadExpensesSuccess, (state, { expenses }) =>
    expensesAdapter.upsertMany(expenses, state)
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

// @Injectable()
// export class NgxsExpensesState {
//   constructor(
//     private store: Store<AuthState>,
//     private expensesService: ExpensesService,
//     private snackbarService: SnackbarService
//   ) { }

//   get user() {
//     return storeSnapshot(this.store, getCurrentUser);
//   }

//   @Action(GetExpenses)
//   getExpenses(
//     ctx: StateContext<ExpensesStateModel>,
//     { index, limit }: GetExpenses
//   ) {
//     if (!this.user) {
//       return;
//     }
//     const { expenseDictionary, count, lastCall } = ctx.getState();

//     if (lastCall) {
//       return;
//     }
//     ctx.patchState({ lastCall: count !== null && index + limit >= count });

//     return this.expensesService.getExpenses(index, limit).pipe(
//       tap((expenses) =>
//         ctx.patchState({
//           expenseDictionary: {
//             ...expenseDictionary,
//             ...toDictionary(expenses),
//           },
//           sorted: true,
//           isLoading: false,
//         })
//       )
//     );
//   }

//   @Action(SetExpensesCount)
//   setExpensesCount(
//     ctx: StateContext<ExpensesStateModel>,
//     { count }: SetExpensesCount
//   ) {
//     ctx.patchState({ count });
//   }

//   @Action(SetExpensesReasons)
//   setExpenseReasons(
//     ctx: StateContext<ExpensesStateModel>,
//     { reasons }: SetExpensesReasons
//   ) {
//     ctx.patchState({ reasons });
//   }

//   @Action(CreateExpense)
//   createExpense(
//     ctx: StateContext<ExpensesStateModel>,
//     { reason, amount, date }: CreateExpense
//   ) {
//     if (!this.user) {
//       return;
//     }
//     const { _id } = this.user;
//     return this.expensesService
//       .create({ reason: reason._id, amount, spendAt: date, person: _id })
//       .pipe(
//         map((exp: Expense) => ({
//           exp: {
//             [exp._id]: { ...exp, person: this.user, reason },
//           } as Dictionary<Expense>,
//         })),
//         tap(
//           () => this.snackbarService.success('Record added!'),
//           () => this.snackbarService.fail('Something went wrong.')
//         ),
//         tap(({ exp }) =>
//           ctx.patchState({
//             sorted: false,
//             expenseDictionary: {
//               ...ctx.getState().expenseDictionary,
//               ...exp,
//             },
//           })
//         )
//       );
//   }
// }
