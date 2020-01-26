import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ExpensesController } from './expenses.controller';
import * as Repositories from './repositories';
import * as Services from './services';
import { ExpenseReasonSchema, ExpenseSchema } from './models';
import { ExpenseReasonsController } from './expense-reasons.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }]),
    MongooseModule.forFeature([
      { name: 'ExpenseReason', schema: ExpenseReasonSchema }
    ]),
    UsersModule
  ],
  controllers: [ExpensesController, ExpenseReasonsController],
  providers: [
    Repositories.ExpensesRepo,
    Repositories.ExpenseReasonsRepo,
    Repositories.ExpensesQueryBuilder,
    Services.ExpensesService,
    Services.ExpenseReasonsService
  ]
})
export class ExpensesModule {}
