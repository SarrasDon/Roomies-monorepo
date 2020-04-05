import { Injectable } from '@nestjs/common';
import { GenericService } from '@roomies/shared.data';
import { ExpenseReasonResource } from '../models';
import { ExpenseReasonsRepo } from '../repositories';
import { ExpenseReason } from '@roomies/expenses.contracts';

@Injectable()
export class ExpenseReasonsService extends GenericService<
  ExpenseReason,
  ExpenseReasonResource
> {
  constructor(public readonly repository: ExpenseReasonsRepo) {
    super(repository);
  }
}
