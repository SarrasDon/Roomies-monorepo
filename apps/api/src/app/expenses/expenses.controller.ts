import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Expense } from '@roomies/expenses.contracts';
import { GenericController } from '@roomies/shared.data';
import { ExpenseResource } from './models';
import { CreateExpenseValidPipe } from './pipes';
import { ExpensesService } from './services';

@Controller('expenses')
@UseGuards(AuthGuard())
export class ExpensesController extends GenericController<
Expense,
ExpenseResource
> {
  constructor(public expensesService: ExpensesService) {
    super(expensesService);
  }

  @Get()
  public async getAll(
    @Query()
    query: {
      userId?: string;
      index: number;
      limit: number;
    }
  ) {
    const queryOptions = {
      id: query.userId || null,
      index: +query.index,
      limit: +query.limit
    };
    return await this.expensesService.pagedFind(queryOptions);
  }

  @Get('totals')
  public async getTotals() {
    return await this.expensesService.getTotals();
  }

  @Get('totalsForMonth')
  public async totalsForMonth(
    @Query()
    query: {
      month: number,
      year: number
    }
  ) {
    const { month, year } = query
    return await this.expensesService.getTotalsForMonth({ month, year });
  }

  @Post()
  public async create(
    @Body(new CreateExpenseValidPipe()) expenseResource: ExpenseResource
  ) {
    return await super.create(expenseResource);
  }
}
