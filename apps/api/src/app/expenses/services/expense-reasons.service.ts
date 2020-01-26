import { Injectable } from '@nestjs/common';
import { ExpenseReason, ExpenseReasonResource } from '../models';
import { ExpenseReasonsRepo } from '../repositories';
import { GenericService } from '../../shared/generics';

@Injectable()
export class ExpenseReasonsService extends GenericService<
  ExpenseReason,
  ExpenseReasonResource
> {
  constructor(public readonly repository: ExpenseReasonsRepo) {
    super(repository);
  }
}
