import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GenericController } from '../shared/generics';
import { Expense, ExpenseResource } from './models';
import { CreateExpenseValidPipe } from './pipes';
import { ExpensesService } from './services';

@Controller('expenses')
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

  @Post()
  public async create(
    @Body(new CreateExpenseValidPipe()) expenseResource: ExpenseResource
  ) {
    return await super.create(expenseResource);
  }
}
