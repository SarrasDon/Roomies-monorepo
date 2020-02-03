import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { UsersService } from '../../users/services';
import { UsersRepository } from '../../users/repositories';
import { RefreshTokensRepository } from '../repositories';
import { environment } from 'apps/api/src/environments/environment';
import { User } from '../../shared/Models';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private refreshTokenRepository: RefreshTokensRepository,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const userDB: any = await this.usersRepository
      .findOneBy({ email })
      .then(res => ({
        _id: res._id,
        name: res.name,
        email: res.email,
        avatarUrl: res.avatarUrl
      }));

    const access_token = await this.jwtService.signAsync({
      email,
      sub: userDB._id
    });
    const refresh_token = await this.jwtService.signAsync({
      userDB,
      sub: userDB._id
    });

    const token = await hash(
      refresh_token,
      process.env['BCRYPT_SALT'] || environment.bcryptSalt
    );

    const tokenDB = await this.refreshTokenRepository
      .upsertOne(
        { person: userDB._id },
        {
          token,
          person: userDB._id
        }
      )
      .exec();

    return {
      user: userDB,
      access_token,
      refresh_token
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    return this.usersRepository.findOneBy({ email }).then(async user => {
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

  async validateToken(user: User, token: string) {
    if (!user || !token) {
      throw new UnauthorizedException();
    }

    const tokenDb = await this.refreshTokenRepository
      .findOneBy({
        person: user._id
      })
      .exec();
    if (!tokenDb) {
      throw new UnauthorizedException();
    }
    const result = await compare(token, tokenDb.token.toString());
    if (!result) {
      throw new UnauthorizedException();
    }

    const access_token = await this.jwtService.signAsync({
      email: user.email,
      sub: user._id
    });
    const refresh_token = await this.jwtService.signAsync({
      user,
      sub: user._id
    });

    const newToken = await hash(
      refresh_token,
      process.env['BCRYPT_SALT'] || environment.bcryptSalt
    );

    await this.refreshTokenRepository
      .upsertOne(
        { person: user._id },
        {
          token: newToken,
          person: user._id
        }
      )
      .exec();

    return {
      user,
      access_token,
      refresh_token
    };
  }
}
