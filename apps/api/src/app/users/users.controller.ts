import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserValidPipe } from './pipes';
import { UserResource } from './models';
import { UsersService } from './services';
import { GenericController } from '../shared/generics';
import { User } from '../shared/Models';

@Controller('users')
export class UsersController extends GenericController<User, UserResource> {
  constructor(public readonly usersService: UsersService) {
    super(usersService);
  }

  @Post()
  public async create(
    @Body(new CreateUserValidPipe()) userResource: UserResource
  ) {
    const user = await super.create(userResource);
    if (!user) throw new BadRequestException('User not created');
    return user;
  }

  @Post('login')
  public async login(@Body() { email, password }) {
    const user = await this.usersService.login({ email, password });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }
}
