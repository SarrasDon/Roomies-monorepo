import { Controller, Delete, Get, Query, Post, Body } from '@nestjs/common';
import { ExpensesService } from './services';
import { CreateExpenseValidPipe } from './pipes';
import { CreateExpenseResource } from './resources';
import { ExpenseCategory } from '../Models';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

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

  @Get('count')
  public async getCount() {
    return await this.expensesService.count();
  }

  @Get('reasons')
  public async getReasons() {
    return await this.expensesService.findAllReasons();
  }

  @Get('totals')
  public async getTotals() {
    return await this.expensesService.getTotals();
  }

  @Post()
  public async create(
    @Body(new CreateExpenseValidPipe()) expenseResource: CreateExpenseResource
  ) {
    return this.expensesService.createExpense(expenseResource);
  }

  @Post('reasons')
  public async createReason(
    @Body()
    reason: {
      category: ExpenseCategory;
      reason: string;
    }
  ) {
    return this.expensesService.createReason(reason);
  }

  @Delete()
  public async deleteAll() {
    return this.expensesService.deleteAll();
  }
}
