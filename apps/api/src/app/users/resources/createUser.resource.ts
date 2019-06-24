import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserResource {
  @IsNotEmpty({ message: 'Name was not provided.' })
  name: string;

  @IsEmail({}, { message: 'The provided email is not valid.' })
  email: string;

  @IsNotEmpty({ message: 'Password was not provided.' })
  password: string;
}
