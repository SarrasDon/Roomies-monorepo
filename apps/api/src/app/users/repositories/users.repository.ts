import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../shared/models';
import { EntityRepository } from '../../shared/generics';

@Injectable()
export class UsersRepository extends EntityRepository<User> {
  constructor(
    @InjectModel('User') public readonly userModel: Model<UserDocument>
  ) {
    super(userModel);
  }

  findAll() {
    return super.findAll().select('_id name avatarUrl email');
  }
}
