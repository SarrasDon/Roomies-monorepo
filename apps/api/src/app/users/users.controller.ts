import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateUserValidPipe } from './pipes';
import { CreateUserResource } from './resources';
import { UsersService } from './services';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async create(
    @Body(new CreateUserValidPipe()) createUserResource: CreateUserResource
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

  @Post('updateAvatar')
  public async updateAvatar(@Body() { _id, avatarUrl }) {
    const update = await this.usersService.updateAvatar(_id, avatarUrl);

    if (!update) throw new BadRequestException('Avatar not updated');
    return update;
  }
}
