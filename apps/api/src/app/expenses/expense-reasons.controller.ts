import { Controller, UseGuards } from '@nestjs/common';
import { GenericController } from '../shared/generics';
import { ExpenseReasonDocument, ExpenseReasonResource } from './models';
import { ExpenseReasonsService } from './services';
import { AuthGuard } from '@nestjs/passport';

@Controller('expenseReasons')
@UseGuards(AuthGuard())
export class ExpenseReasonsController extends GenericController<
  ExpenseReasonDocument,
  ExpenseReasonResource
> {
  constructor(public readonly service: ExpenseReasonsService) {
    super(service);
  }
}
