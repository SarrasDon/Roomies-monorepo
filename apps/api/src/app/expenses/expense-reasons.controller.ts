import { Controller } from '@nestjs/common';
import { GenericController } from '../shared/generics';
import { ExpenseReason, ExpenseReasonResource } from './models';
import { ExpenseReasonsService } from './services';

@Controller('expenseReasons')
export class ExpenseReasonsController extends GenericController<
  ExpenseReason,
  ExpenseReasonResource
> {
  constructor(public readonly service: ExpenseReasonsService) {
    super(service);
  }
}
