import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../../environments/environment';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { RefreshTokenSchema } from './refresh-token.model';
import { RefreshTokensRepository } from './repositories';
import { AuthService, JwtStrategy, LocalStrategy } from './services';

@Module({
  exports: [],
  imports: [
    UsersModule,
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env['AUTH_JWT_SECRET'] || environment.authSecret,
      signOptions: { expiresIn: 3600 }
    }),
    MongooseModule.forFeature([
      { name: 'RefreshToken', schema: RefreshTokenSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService, RefreshTokensRepository]
})
export class AuthModule {}
