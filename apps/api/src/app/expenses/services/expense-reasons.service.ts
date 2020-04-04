import { Injectable } from '@nestjs/common';
import { ExpenseReasonDocument, ExpenseReasonResource } from '../models';
import { ExpenseReasonsRepo } from '../repositories';
import { GenericService } from '../../shared/generics';

@Injectable()
export class ExpenseReasonsService extends GenericService<
  ExpenseReasonDocument,
  ExpenseReasonResource
> {
  constructor(public readonly repository: ExpenseReasonsRepo) {
    super(repository);
  }
}
