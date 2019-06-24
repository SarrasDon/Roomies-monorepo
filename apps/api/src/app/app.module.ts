import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MONGODB_CON_STRING_DEV, MONGODB_CON_STRING_PROD } from '../constants';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_CON_STRING_DEV, { useNewUrlParser: true }),
    UsersModule,
    ExpensesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
