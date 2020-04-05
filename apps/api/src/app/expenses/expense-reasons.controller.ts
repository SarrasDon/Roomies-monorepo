import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { ExpenseReasonResource } from './models';
import { ExpenseReasonsService } from './services';
import { GenericController } from '@roomies/shared.data';

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
