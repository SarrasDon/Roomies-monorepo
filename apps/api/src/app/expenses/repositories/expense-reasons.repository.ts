import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../shared/generics';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { DocType } from '../../shared/interfaces/document.type';

@Injectable()
export class ExpenseReasonsRepo extends EntityRepository<ExpenseReason> {
  constructor(
    @InjectModel('ExpenseReason')
    public readonly expenseReasonModel: Model<DocType<ExpenseReason>>
  ) {
    super(expenseReasonModel);
  }
}
