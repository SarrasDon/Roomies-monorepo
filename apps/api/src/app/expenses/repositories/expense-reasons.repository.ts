import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '@roomies/shared.data';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { DocType } from '@roomies/shared.data';

@Injectable()
export class ExpenseReasonsRepo extends EntityRepository<ExpenseReason> {
  constructor(
    @InjectModel('ExpenseReason')
    public readonly expenseReasonModel: Model<DocType<ExpenseReason>>
  ) {
    super(expenseReasonModel);
  }
}
