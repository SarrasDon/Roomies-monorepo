import { createSelector } from '@ngrx/store';
import {
  ExpensesState,
  expensesFeatureKey,
  expensesAdapter,
} from './expenses.state';
import { createFeatureSelector } from '@ngrx/store';

export const selectExpensesState = createFeatureSelector<ExpensesState>(
  expensesFeatureKey
);

export const { selectAll: selectExpenses } = expensesAdapter.getSelectors(
  selectExpensesState
);

export const selectExpenseReasons = createSelector(
  selectExpensesState,
  (state) => state.reasons
);

export const selectIsLoading = createSelector(
  selectExpensesState,
  (state) => state.isLoading
);

// export class ExpenseSelectors extends NgxsExpensesState {

//   @Selector()
//   public static expenses(state: ExpensesStateModel): Expense[] {
//     if (!state.expenseDictionary) {
//       return [];
//     }
//     return state.sorted
//       ? Object.values(state.expenseDictionary)
//       : Object.values(state.expenseDictionary).sort((a, b) =>
//           new Date(a.spendAt).valueOf() > new Date(b.spendAt).valueOf()
//             ? -1
//             : new Date(a.spendAt).valueOf() < new Date(b.spendAt).valueOf()
//             ? 1
//             : 0
//         );
//   }
//   @Selector()
//   public static reasons(state: ExpensesStateModel) {
//     return state.reasons;
//   }

//   @Selector()
//   static isLoading({ isLoading }: ExpensesStateModel) {
//     return isLoading;
//   }
// }
