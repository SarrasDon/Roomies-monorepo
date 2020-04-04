import { ExpenseCategory } from '@roomies/expenses.contracts';

export interface ExpenseReasonResource {
  category: ExpenseCategory;
  reason: string;
}
