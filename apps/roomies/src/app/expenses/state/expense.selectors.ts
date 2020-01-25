import { Selector } from '@ngxs/store';
import { Expense } from '../../shared/models';
import { ExpensesState, ExpensesStateModel, calcTotal } from './expenses.state';
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
      : Object.values(state.expenseDictionary).sortBySpendDate();
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
}
