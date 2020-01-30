import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { environment } from '../../environments/environment';
import { UsersModule } from '../users/users.module';
import { AuthController } from './Auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
@Module({
  exports: [],
  imports: [
    UsersModule,
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env['AUTH_JWT_SECRET'] || environment.authSecret,
      signOptions: { expiresIn: '60s' }
    })
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService]
})
export class AuthModule {}
