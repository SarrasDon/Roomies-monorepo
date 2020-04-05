import { Entity } from '@roomies/shared.data';

export enum ExpenseCategory {
  Groceries,
  Bills,
  Furniture,
  Fun
}

export interface ExpenseReason extends Entity {
  category: ExpenseCategory;
  reason: string;
}
