import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryBuilder } from '../../shared/generics';
import { Expense, ExpenseReason } from '../models';
import { User } from '../../shared/models';

@Injectable()
export class ExpensesQueryBuilder extends QueryBuilder<Expense> {
  constructor(
    @InjectModel('Expense')
    private readonly model: Model<Expense>
  ) {
    super(model);
  }

  forUser(id: string) {
    return this.where('person', id);
  }

  sortByDescDate() {
    return this.sorting('spendAt', -1);
  }

  includeUserAndReason() {
    return this.populate<User>('person', 'name').populate<ExpenseReason>(
      'reason',
      'reason'
    );
  }

  pluck() {
    return this.select('reason', 'amount', 'spendAt', 'person');
  }
}
