import { IsNotEmpty, IsEmail } from 'class-validator';
import { User } from '../../shared/models';

export class UserResource implements Partial<User> {
  @IsNotEmpty({ message: 'Name was not provided.' })
  name: string;

  @IsEmail({}, { message: 'The provided email is not valid.' })
  email: string;

  @IsNotEmpty({ message: 'Password was not provided.' })
  password: string;

  avatarUrl: string;
}
