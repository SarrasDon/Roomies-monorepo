import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { GenericController } from '../shared/generics';
import { User } from '../shared/Models';
import { UserResource } from './models';
import { CreateUserValidPipe } from './pipes';
import { UsersService } from './services';

@Controller('users')
export class UsersController extends GenericController<User, UserResource> {
  constructor(public readonly usersService: UsersService) {
    super(usersService);
  }

  @Post()
  public async create(
    @Body(new CreateUserValidPipe()) userResource: UserResource
  ) {
    const user = (await this.usersService.createUser(userResource)) as any;
    if (!user) throw new BadRequestException('User not created');
    return user;
  }
}
