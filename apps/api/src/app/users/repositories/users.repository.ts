import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '@roomies/shared.data';
import { DocType } from '@roomies/shared.data';
import { User } from '@roomies/user.contracts';

@Injectable()
export class UsersRepository extends EntityRepository<User> {
  constructor(
    @InjectModel('User') public readonly userModel: Model<DocType<User>>
  ) {
    super(userModel);
  }

  findAll() {
    return super.findAll().select('_id name avatarUrl email');
  }
}
