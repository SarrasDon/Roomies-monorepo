import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryBuilder } from '../../shared/generics';
import { ExpenseDocument, ExpenseReasonDocument } from '../models';
import { User } from '../../shared/Models';

@Injectable()
export class ExpensesQueryBuilder extends QueryBuilder<ExpenseDocument> {
  constructor(
    @InjectModel('Expense')
    private readonly model: Model<ExpenseDocument>
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
    return this.populate<User>('person', 'name').populate<
      ExpenseReasonDocument
    >('reason', 'reason');
  }

  pluck() {
    return this.select('reason', 'amount', 'spendAt', 'person');
  }
}
