import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpensesQueryBuilder } from './expenses-query.builder';
import { Repository } from '../../Repositories/generics';
import { Expense } from '../../Models';

@Injectable()
export class ExpensesRepo extends Repository<Expense> {
  constructor(
    @InjectModel('Expense')
    private readonly expenseModel: Model<Expense>,
    private queryBuilder: ExpensesQueryBuilder,
  ) {
    super(expenseModel);
  }

  pagedFind(queryOptions: { id?: string; index: number; limit: number }) {
    const { id, index, limit } = queryOptions;

    return this.queryBuilder
      .forUser(id)
      .sortByDescDate()
      .paging(index, limit)
      .includeUserAndReason()
      .pluck()
      .build();
  }

  getTotals() {
    return this.model.aggregate([
      {
        $group: {
          _id: '$person',
          total: { $sum: '$amount' },
        },
      },
    ]);
  }
}
