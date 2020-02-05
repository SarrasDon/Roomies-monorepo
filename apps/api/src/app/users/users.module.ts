import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../shared/Models';
import * as Repositories from './repositories';
import * as Services from './services';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  exports: [Repositories.UsersRepository, Services.UsersService],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [UsersController],
  providers: [Services.UsersService, Repositories.UsersRepository]
})
export class UsersModule {}
