import { Injectable } from '@nestjs/common';
import { CreateUserResource } from '../resources';
import { UsersRepo } from '../repositories';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepo) {}

  async create(createUsersDto: CreateUserResource) {
    return this.repo
      .create(createUsersDto)
      .save()
      .then(({ email, name, _id }) => ({ email, name, _id }));
  }

  async login({ email, password }) {
    return this.repo
      .findBy({ email, password })
      .select('_id email name')
      .exec();
  }

  async deleteAll() {
    return this.repo.deleteAll().exec();
  }
}
