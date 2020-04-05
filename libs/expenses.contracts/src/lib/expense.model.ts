import { User } from '@roomies/user.contracts';
import { ExpenseReason } from './expense-reason.model';
import { Entity } from '@roomies/shared.data';

export interface Expense extends Entity {
  reason: ExpenseReason;
  amount: number;
  createdAt: Date;
  spendAt: Date;
  person: User;
}
