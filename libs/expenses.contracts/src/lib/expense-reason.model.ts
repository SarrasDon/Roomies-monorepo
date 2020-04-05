export enum ExpenseCategory {
  Groceries,
  Bills,
  Furniture,
  Fun
}

export interface ExpenseReason {
  _id: string | any;
  category: ExpenseCategory;
  reason: string;
}
