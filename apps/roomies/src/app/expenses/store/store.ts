import { createFeatureSelector } from '@ngrx/store';
import {
  expensesFeatureKey,
  expensesReducer,
  ExpensesState,
} from './expenses.reducer';
import {
  monthlyExpenseFeatureKey,
  monthlyExpensesReducer,
  MonthlyExpenseState,
} from './monthlyExpenses.reducer';
import { totalsFeatureKey, totalsReducer, TotalState } from './totals.reducer';

export const featureModuleKey = 'expensesModule';

export const featureReducersMap = {
  [totalsFeatureKey]: totalsReducer,
  [expensesFeatureKey]: expensesReducer,
  [monthlyExpenseFeatureKey]: monthlyExpensesReducer,
};

export interface ExpensesModuleState {
  [totalsFeatureKey]: TotalState;
  [expensesFeatureKey]: ExpensesState;
  [monthlyExpenseFeatureKey]: MonthlyExpenseState;
}
