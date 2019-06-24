import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../Models';
import { Repository } from '../../Repositories/generics';

@Injectable()
export class UsersRepo extends Repository<User> {
  constructor(@InjectModel('User') public readonly userModel: Model<User>) {
    super(userModel);
  }

  findAll() {
    return super.findAll().select('_id name');
  }
}
