import { Schema } from 'mongoose';

export enum ExpenseCategory {
  Groceries,
  Bills,
  Furniture,
  Fun
}

export const ExpenseReasonSchema = new Schema({
  category: String,
  reason: String
});
