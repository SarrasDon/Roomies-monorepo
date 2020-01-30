import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { environment } from '../environments/environment';
import { AuthModule } from './auth/auth.module';

const connectionString =
  process.env.MONGO_DB_CONN_STRING || environment.mongoDBstring;

@Module({
  imports: [
    MongooseModule.forRoot(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    AuthModule,
    UsersModule,
    ExpensesModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
