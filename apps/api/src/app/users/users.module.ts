import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../shared/Models';
import * as Repositories from './repositories';
import * as Services from './services';
import { UsersController } from './users.controller';

@Module({
  exports: [Repositories.UsersRepository, Services.UsersService],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [Services.UsersService, Repositories.UsersRepository]
})
export class UsersModule {}
