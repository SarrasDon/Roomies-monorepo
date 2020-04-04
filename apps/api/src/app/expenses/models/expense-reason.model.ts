import { Schema, Document } from 'mongoose';

export interface ExpenseReason {
  _id: string | any;
  category: ExpenseCategory;
  reason: string;
}

export interface ExpenseReasonDocument extends ExpenseReason, Document {}

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
