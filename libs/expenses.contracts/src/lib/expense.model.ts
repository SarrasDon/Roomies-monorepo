export interface Expense {
  _id: string | any;
  reason: string;
  amount: number;
  createdAt: Date;
  spendAt: Date;
  person: string;
}
