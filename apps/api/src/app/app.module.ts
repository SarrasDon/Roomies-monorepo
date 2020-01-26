import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { environment } from '../environments/environment';

const connectionString = environment.mongoDBstring;

@Module({
  imports: [
    MongooseModule.forRoot(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    UsersModule,
    ExpensesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
