import { Schema, Document } from 'mongoose';

export const ExpenseReasonSchema = new Schema({
  category: String,
  reason: String
});
