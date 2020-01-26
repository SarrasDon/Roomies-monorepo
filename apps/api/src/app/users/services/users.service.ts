import { Injectable } from '@nestjs/common';
import { UsersRepo } from '../repositories';
import { CreateUserResource } from '../resources';

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
      .select('_id email name avatarUrl')
      .exec();
  }

  async updateAvatar(_id: string, avatarUrl: string) {
    return this.repo.updateOne(_id, { avatarUrl }).exec();
  }
}
