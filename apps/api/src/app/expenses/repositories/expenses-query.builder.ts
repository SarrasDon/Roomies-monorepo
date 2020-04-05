import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryBuilder } from '../../shared/generics';
import { User } from '../../shared/Models';
import { DocType } from '../../shared/interfaces/document.type';
import { Expense } from '@roomies/expenses.contracts';

@Injectable()
export class ExpensesQueryBuilder extends QueryBuilder<DocType<Expense>> {
  constructor(
    @InjectModel('Expense')
    private readonly model: Model<DocType<Expense>>
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
    return this.populate<User>('person', 'name').populate<DocType<Expense>>(
      'reason',
      'reason'
    );
  }

  pluck() {
    return this.select('reason', 'amount', 'spendAt', 'person');
  }
}
