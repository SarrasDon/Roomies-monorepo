import { Selector } from '@ngxs/store';
import { ExpensesState, ExpensesStateModel } from './expenses.state';
import { Expense } from '@roomies/expenses.contracts';

export class ExpenseSelectors extends ExpensesState {
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
      : Object.values(state.expenseDictionary).sort((a, b) =>
        new Date(a.spendAt).valueOf() > new Date(b.spendAt).valueOf()
          ? -1
          : new Date(a.spendAt).valueOf() < new Date(b.spendAt).valueOf()
            ? 1
            : 0
      );
  }
  @Selector()
  public static reasons(state: ExpensesStateModel) {
    return state.reasons;
  }

  @Selector()
  static isLoading({ isLoading }: ExpensesStateModel) {
    return isLoading;
  }
}
