import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/services';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const userDB: any = await this.userService.getOneBy({ email }).then(res => {
      return {
        _id: res._id,
        name: res.name,
        email: res.email,
        avatarUrl: res.avatarUrl
      };
    });

    const access_token = this.jwtService.sign({ email, sub: userDB._id });

    return {
      user: userDB,
      access_token
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    return this.userService.getOneBy({ email }).then(async user => {
      if (!user || !user.password) {
        return null;
      }
      const result = await compare(pass, user.password.toString());

      if (!result) {
        return null;
      }
      return user;
    });
  }
}
