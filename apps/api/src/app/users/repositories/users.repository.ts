import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../shared/Models';
import { EntityRepository } from '../../shared/generics';
import { DocType } from '../../shared/interfaces/document.type';

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
