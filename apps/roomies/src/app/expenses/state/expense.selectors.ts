import { Selector } from '@ngxs/store';
import { ExpensesState, ExpensesStateModel, calcTotal } from './expenses.state';
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
  static totals(state: ExpensesStateModel) {
    return state.totals.map(t => ({
      name: t.user.name,
      value: t.total
    }));
  }
  @Selector()
  static sum(state: ExpensesStateModel) {
    return calcTotal(state.totals);
  }
  @Selector()
  static balance(
    state: ExpensesStateModel
  ): {
    amount: number;
    sign: 'positive' | 'negative' | 'balanced';
  } {
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
  static isLoading({ isLoading }: ExpensesStateModel) {
    return isLoading;
  }
}
