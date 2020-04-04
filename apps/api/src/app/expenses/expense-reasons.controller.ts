import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { GenericController } from '../shared/generics';
import { ExpenseReasonResource } from './models';
import { ExpenseReasonsService } from './services';

@Controller('expenseReasons')
@UseGuards(AuthGuard())
export class ExpenseReasonsController extends GenericController<
  ExpenseReason,
  ExpenseReasonResource
> {
  constructor(public readonly service: ExpenseReasonsService) {
    super(service);
  }
}
