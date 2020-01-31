import { Injectable } from '@nestjs/common';
import { GenericService } from '../../shared/generics';
import { User } from '../../shared/Models';
import { UserResource } from '../models';
import { UsersRepo } from '../repositories';
import { hash } from 'bcryptjs';

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
    const password = await hash(
      createUsersDto.password,
      process.env['BCRYPT_SALT']
    );

    return await this.repository
      .create({ ...createUsersDto, password })
      .save()
      .then(({ email, name, _id }) => ({ email, name, _id }));
  }
}
