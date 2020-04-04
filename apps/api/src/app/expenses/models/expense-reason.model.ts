import { Schema, Document } from 'mongoose';
import { ExpenseReason } from '@roomies/expenses.contracts';

export interface ExpenseReasonDocument extends ExpenseReason, Document {}

export const ExpenseReasonSchema = new Schema({
  category: String,
  reason: String
});
