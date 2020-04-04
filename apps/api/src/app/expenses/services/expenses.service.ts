import { Injectable } from '@nestjs/common';
import { Expense } from '@roomies/expenses.contracts';
import { GenericService } from '../../shared/generics';
import { UsersRepository } from '../../users/repositories';
import { ExpenseResource } from '../models';
import { ExpensesRepo } from '../repositories';

@Injectable()
export class ExpensesService extends GenericService<Expense, ExpenseResource> {
  constructor(
    public readonly expensesRepo: ExpensesRepo,
    private usersRepo: UsersRepository
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
    const totals = await this.expensesRepo.getTotals();
    const users = await this.usersRepo.findAll().exec();

    return totals.map(({ total, _id }) => ({
      total,
      user: users.find(u => u._id.toString() === _id.toString()),
      count: users.length
    }));
  }
}
