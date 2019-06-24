import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../Models';
import { UsersController } from './users.controller';
import * as Services from './services';
import * as Repositories from './repositories';

@Module({
  exports: [Repositories.UsersRepo],
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UsersController],
  providers: [Services.UsersService, Repositories.UsersRepo],
})
export class UsersModule {}
