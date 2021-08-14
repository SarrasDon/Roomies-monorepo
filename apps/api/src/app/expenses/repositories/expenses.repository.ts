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
      .pluck()
      .build()
      .exec();
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

  getTotalsForDay(date: Date) {
    return this.model.aggregate([
      {
        $match: {
          spendAt: {
            $gte: date,
            $lt: new Date(date.setDate(date.getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: '$person',
          total: { $sum: '$amount' },
        },
      },
    ]);
  }

  getTotalsForMonth({ month, year }: { month: number; year: number }) {
    const min = new Date(year, month, 1);
    const max = new Date(
      new Date(year, month, 1).setMonth(new Date(year, month, 1).getMonth() + 1)
    );

    return this.model.aggregate([
      {
        $match: {
          spendAt: {
            $gte: min,
            $lt: max,
          },
        },
      },
      {
        $group: {
          _id: '$person',
          total: { $sum: '$amount' },
        },
      },
    ]);
  }
}
