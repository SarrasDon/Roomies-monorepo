import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../shared/generics';
import { ExpenseReasonDocument } from '../models';

@Injectable()
export class ExpenseReasonsRepo extends EntityRepository<
  ExpenseReasonDocument
> {
  constructor(
    @InjectModel('ExpenseReason')
    public readonly expenseReasonModel: Model<ExpenseReasonDocument>
  ) {
    super(expenseReasonModel);
  }
}
