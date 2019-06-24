import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Repository } from '../../Repositories/generics';
import { ExpenseReason } from '../../Models';

@Injectable()
export class ExpenseReasonsRepo extends Repository<ExpenseReason> {
  constructor(
    @InjectModel('ExpenseReason')
    public readonly expenseReasonModel: Model<ExpenseReason>,
  ) {
    super(expenseReasonModel);
  }
}
