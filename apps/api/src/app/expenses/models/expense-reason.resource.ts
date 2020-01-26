import { ExpenseCategory } from './expense-reason.model';

export interface ExpenseReasonResource {
  category: ExpenseCategory;
  reason: string;
}
