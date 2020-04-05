import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '@roomies/shared.data';
import { ExpensesQueryBuilder } from './expenses-query.builder';
import { Expense } from '@roomies/expenses.contracts';
import { DocType } from '@roomies/shared.data';

@Injectable()
export class ExpensesRepo extends EntityRepository<Expense> {
  constructor(
    @InjectModel('Expense')
    private readonly expenseModel: Model<DocType<Expense>>,
    private queryBuilder: ExpensesQueryBuilder
  ) {
    super(expenseModel);
  }

  async pagedFind(queryOptions: { id?: string; index: number; limit: number }) {
    const { id, index, limit } = queryOptions;

    return await this.queryBuilder
      .forUser(id)
      .sortByDescDate()
      .paging(index, limit)
      .includeUserAndReason()
      .pluck()
      .build()
      .exec();
  }

  getTotals() {
    return this.model.aggregate([
      {
        $group: {
          _id: '$person',
          total: { $sum: '$amount' }
        }
      }
    ]);
  }
}
