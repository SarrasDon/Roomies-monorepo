import { Injectable } from '@nestjs/common';
import { GenericService } from '../../shared/generics';
import { UsersRepository } from '../../users/repositories';
import { ExpenseDocument, ExpenseResource } from '../models';
import { ExpensesRepo } from '../repositories';

@Injectable()
export class ExpensesService extends GenericService<
  ExpenseDocument,
  ExpenseResource
> {
  constructor(
    public readonly expensesRepo: ExpensesRepo,
    private usersRepo: UsersRepository
  ) {
    super(expensesRepo);
  }

  async createExpense(resource: ExpenseResource): Promise<ExpenseDocument> {
    return await super.create({
      ...resource,
      amount: +resource.amount
    });
  }

  async pagedFind(queryOptions: {
    id?: string;
    index: number;
    limit: number;
  }): Promise<ExpenseDocument[]> {
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

  // async createReason(reason: { category: ExpenseCategory; reason: string }) {
  //   return this.reasonsRepo
  //     .create({
  //       ...reason
  //     })
  //     .save();
  // }
}
