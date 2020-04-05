import { ExpenseReason } from '@roomies/expenses.contracts';

export interface CreateExpenseConfig {
  reasons: ExpenseReason[];
}
