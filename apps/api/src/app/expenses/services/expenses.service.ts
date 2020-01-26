import { Injectable } from '@nestjs/common';
import { GenericService } from '../../shared/generics';
import { UsersRepo } from '../../users/repositories';
import { Expense, ExpenseResource } from '../models';
import { ExpenseReasonsRepo, ExpensesRepo } from '../repositories';

@Injectable()
export class ExpensesService extends GenericService<Expense, ExpenseResource> {
  constructor(
    public readonly expensesRepo: ExpensesRepo,
    private reasonsRepo: ExpenseReasonsRepo,
    private usersRepo: UsersRepo
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

  // async findAllReasons() {
  //   return this.reasonsRepo.findAll().exec();
  // }

  async getTotals() {
    const totals = await this.expensesRepo.getTotals();
    const users = await this.usersRepo.findAll().exec();

    return totals.map(({ total, _id }) => ({
      total,
      user: users.find(u => u._id.toString() === _id.toString()),
      count: users.length
    }));
  }

  // async createReason(reason: { category: ExpenseCategory; reason: string }) {
  //   return this.reasonsRepo
  //     .create({
  //       ...reason
  //     })
  //     .save();
  // }
}
