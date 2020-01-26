import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../repositories';
import { UserResource } from '../models';
import { GenericService } from '../../shared/generics';
import { User } from '../../shared/Models';

@Injectable()
export class UsersService extends GenericService<User, UserResource> {
  constructor(public repository: UsersRepo) {
    super(repository);
  }

  create(createUsersDto: UserResource) {
    throw new Error('User method createUser');
    return null;
  }

  async createUser(createUsersDto: UserResource) {
    return await this.repository
      .create(createUsersDto)
      .save()
      .then(({ email, name, _id }) => ({ email, name, _id }));
  }

  async login({ email, password }) {
    return await this.repository
      .findBy({ email, password })
      .select('_id email name avatarUrl')
      .exec();
  }
}
