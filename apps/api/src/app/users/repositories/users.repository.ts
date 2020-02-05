import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../shared/Models';
import { EntityRepository } from '../../shared/generics';

@Injectable()
export class UsersRepository extends EntityRepository<User> {
  constructor(@InjectModel('User') public readonly userModel: Model<User>) {
    super(userModel);
  }

  findAll() {
    return super.findAll().select('_id name avatarUrl email');
  }
}
