import { Injectable } from '@nestjs/common';
import { GenericService } from '@roomies/shared.data';
import { User } from '../../shared/Models';
import { UserResource } from '../models';
import { hash } from 'bcryptjs';
import { UsersRepository } from '../repositories';

@Injectable()
export class UsersService extends GenericService<User, UserResource> {
  constructor(public repository: UsersRepository) {
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
