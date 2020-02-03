import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './services';
import { environment } from '../../environments/environment';
import { User } from '../shared/Models';

@Controller('auth')
export class AuthController {
  constructor(public readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public async login(@Body() { email, password }, @Res() res: Response) {
    const result = await this.authService.login(email, password);

    const { refresh_token, ...user } = result;
    res.cookie('refreshToken', refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: environment.production,
      httpOnly: true
    });

    res.status(HttpStatus.CREATED).send(user);
  }

  @Post('refresh')
  public async refresh(
    @Body() user: User,
    @Request() req,
    @Res() res: Response
  ) {
    const result = await this.authService.validateToken(
      user,
      req.cookies['refreshToken']
    );

    const { refresh_token, ...userDB } = result;
    res.cookie('refreshToken', refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: environment.production,
      httpOnly: true
    });

    res.status(HttpStatus.CREATED).send(userDB);
  }
}
