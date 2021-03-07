import { Injectable } from '@nestjs/common';
import { Expense } from '@roomies/expenses.contracts';
import { GenericService } from '@roomies/shared.data';
import { ExpenseResource } from '../models';
import { ExpensesRepo } from '../repositories';

@Injectable()
export class ExpensesService extends GenericService<Expense, ExpenseResource> {
  constructor(
    public readonly expensesRepo: ExpensesRepo,
  ) {
    super(expensesRepo);
  }

  async createExpense(resource: ExpenseResource): Promise<Expense> {
    return await super.create({
      ...resource,
      amount: +resource.amount
    });
  }

  async pagedFind(queryOptions: {
    id?: string;
    index: number;
    limit: number;
  }): Promise<Expense[]> {
    return await this.expensesRepo.pagedFind(queryOptions);
  }

  async getTotals() {
    return await this.expensesRepo.getTotals();
  }

  async getTotalsForMonth({ year, month }: { month: number, year: number }) {
    return await this.expensesRepo.getTotalsForMonth({ year, month });
  }
}
