import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../shared/Models';
import * as Repositories from './repositories';
import * as Services from './services';
import { UsersController } from './users.controller';

@Module({
  exports: [Repositories.UsersRepo, Services.UsersService],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [Services.UsersService, Repositories.UsersRepo]
})
export class UsersModule {}
