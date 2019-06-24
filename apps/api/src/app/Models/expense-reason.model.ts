import { Document, Schema } from 'mongoose';

export enum ExpenseCategory {
  Groceries,
  Bills,
  Furniture,
  Fun,
}

export interface ExpenseReason extends Document {
  category: ExpenseCategory;
  reason: String;
}

export const ExpenseReasonSchema = new Schema({
  category: String,
  reason: String,
});
