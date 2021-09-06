import { Entity } from '@roomies/shared.data';

export enum ExpenseCategory {
  Groceries,
  Bills,
  Furniture,
  Fun,
  Delivery,
  Car,
}

export interface ExpenseReason extends Entity {
  category: ExpenseCategory;
  reason: string;
}
