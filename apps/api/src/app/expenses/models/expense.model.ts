import { Document, Schema } from 'mongoose';
import { Expense } from '@roomies/expenses.contracts';

export interface ExpenseDocument extends Expense, Document {}

export const ExpenseSchema = new Schema({
  amount: Number,
  createdAt: Date,
  spendAt: Date,
  person: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: {
    type: Schema.Types.ObjectId,
    ref: 'ExpenseReason'
  }
});

ExpenseSchema.pre<ExpenseDocument>('save', function(next) {
  if (!this.createdAt) this.createdAt = new Date();
  if (!this.spendAt) this.spendAt = new Date();
  next();
});
