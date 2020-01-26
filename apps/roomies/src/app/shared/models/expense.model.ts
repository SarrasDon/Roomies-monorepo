import { User } from './user.model';
import { ExpenseReason } from './expenseReason.model';
import { Entity } from '../interfaces';

export interface Expense extends Entity {
  spendAt: string;
  person: User;
  reason: ExpenseReason;
  amount: number;
}
