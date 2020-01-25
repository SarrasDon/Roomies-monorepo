import { Injectable } from '@nestjs/common';
import { ExpensesRepo } from '../repositories';
import { ExpenseReasonsRepo } from '../repositories';
import { CreateExpenseResource } from '../resources';
import { Expense, ExpenseCategory } from '../../Models';
import { UsersRepo } from '../../users/repositories';

@Injectable()
export class ExpensesService {
  constructor(
    private expensesRepo: ExpensesRepo,
    private reasonsRepo: ExpenseReasonsRepo,
    private usersRepo: UsersRepo
  ) {}

  async createExpense(resource: CreateExpenseResource): Promise<Expense> {
    return this.expensesRepo
      .create({
        ...resource,
        amount: +resource.amount
      })
      .save();
  }

  async pagedFind(queryOptions: {
    id?: string;
    index: number;
    limit: number;
  }): Promise<Expense[]> {
    return await this.expensesRepo.pagedFind(queryOptions);
  }

  async count() {
    return await this.expensesRepo.count();
  }

  async deleteAll() {
    return this.expensesRepo.deleteAll().exec();
  }

  async findAllReasons() {
    return this.reasonsRepo.findAll().exec();
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

  async createReason(reason: { category: ExpenseCategory; reason: string }) {
    return this.reasonsRepo
      .create({
        ...reason
      })
      .save();
  }
}
