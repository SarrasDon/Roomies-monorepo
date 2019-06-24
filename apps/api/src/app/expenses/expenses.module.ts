import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import * as Repositories from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import * as Services from './services';
import { ExpenseSchema, ExpenseReasonSchema } from '../Models';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }]),
    MongooseModule.forFeature([
      { name: 'ExpenseReason', schema: ExpenseReasonSchema },
    ]),
    UsersModule,
  ],
  controllers: [ExpensesController],
  providers: [
    Repositories.ExpensesRepo,
    Repositories.ExpenseReasonsRepo,
    Repositories.ExpensesQueryBuilder,
    Services.ExpensesService,
  ],
})
export class ExpensesModule {}
