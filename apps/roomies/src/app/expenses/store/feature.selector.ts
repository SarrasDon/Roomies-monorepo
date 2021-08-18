import { createFeatureSelector } from '@ngrx/store';
import { featureModuleKey, ExpensesModuleState } from './store';

export const selectExpensesFeatureState = createFeatureSelector<ExpensesModuleState>(
  featureModuleKey
);
