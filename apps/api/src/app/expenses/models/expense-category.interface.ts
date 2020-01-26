import { Document } from 'mongoose';
import { ExpenseCategory } from './expense-reason.model';

export interface ExpenseReason extends Document {
  category: ExpenseCategory;
  reason: String;
}
