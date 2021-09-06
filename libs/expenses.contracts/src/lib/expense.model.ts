import { Entity } from '@roomies/shared.data';

export interface Expense extends Entity {
  reason: string;
  amount: number;
  createdAt: Date;
  spendAt: Date;
  person: string;
}
