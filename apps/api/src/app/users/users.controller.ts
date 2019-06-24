import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './services';
import { CreateUserValidPipe } from './pipes';
import { CreateUserResource } from './resources';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(
    @Body(new CreateUserValidPipe()) createUserResource: CreateUserResource,
  ) {
    const user = await this.usersService.create(createUserResource);
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
