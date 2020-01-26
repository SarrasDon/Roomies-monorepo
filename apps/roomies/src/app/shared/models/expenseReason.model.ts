import { Entity } from '../interfaces';

export interface ExpenseReason extends Entity {
  reason: 'Furniture' | 'Groceries' | 'Bills' | 'Fun';
}
