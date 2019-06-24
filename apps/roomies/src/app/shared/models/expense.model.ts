import { User } from './user.model';
import { ExpenseReason } from './expenseReason.model';

export class Expense {
  _id: string;
  spendAt: string;
  person: User;
  reason: ExpenseReason;
  amount: number;
}
