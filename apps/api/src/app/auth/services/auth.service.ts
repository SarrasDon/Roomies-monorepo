import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environment } from 'apps/api/src/environments/environment';
import { compare, hash } from 'bcryptjs';
import { User } from '../../shared/Models';
import { UsersRepository } from '../../users/repositories';
import { RefreshTokensRepository } from '../repositories';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private refreshTokenRepository: RefreshTokensRepository,
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user: Partial<User> = await this.usersRepository
      .findOneBy({ email })
      .exec()
      .then(res => {
        return {
          _id: res._id,
          name: res.name,
          email: res.email,
          avatarUrl: res.avatarUrl
        };
      });

    const access_token = await this.createToken(email, user._id);
    const refresh_token = await this.createToken(user, user._id);

    await this.saveRefreshToken(refresh_token, user._id);
    return {
      user,
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

  async validateRefreshToken(user: User, token: string) {
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

    const access_token = await this.createToken(user.email, user._id);
    const refresh_token = await this.createToken(user, user._id);

    await this.saveRefreshToken(refresh_token, user._id);

    return {
      user,
      access_token,
      refresh_token
    };
  }

  private async hashToken(token: string) {
    return await hash(
      token,
      +process.env['BCRYPT_SALT'] || environment.bcryptSalt
    );
  }

  private async createToken(payload: any, userId: any) {
    return await this.jwtService.signAsync({ payload, sub: userId });
  }

  private async saveRefreshToken(refresh_token: string, userId: string) {
    const token = await this.hashToken(refresh_token);
    await this.refreshTokenRepository
      .upsertOne({ person: userId }, { token, person: userId })
      .exec();
  }
}
