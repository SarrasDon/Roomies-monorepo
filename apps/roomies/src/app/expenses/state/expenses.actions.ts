import { ExpenseReason } from '../../shared/models/expenseReason.model';

export class GetExpenses {
  static readonly type = '[Expenses] Get Expenses';

  constructor(public index: number, public limit: number) {}
}

export class GetExpenseReasons {
  static readonly type = '[Create Expense Form]] Get Expense Reasons';

  constructor() {}
}

export class CreateExpense {
  static readonly type = '[Create Expense Form] Create new Expense';

  constructor(
    public reason: ExpenseReason,
    public amount: number,
    public date: Date
  ) {}
}

export class GetTotals {
  static readonly type = '[Totals] Get Expense Totals per User';

  constructor() {}
}
