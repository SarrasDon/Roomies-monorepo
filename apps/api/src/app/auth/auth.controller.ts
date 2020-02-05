import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
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
    this.addRefreshToken(refresh_token, res);

    res.status(HttpStatus.CREATED).send(user);
  }

  @Post('refresh')
  public async refresh(
    @Body() user: User,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.authService.validateRefreshToken(
      user,
      req.cookies['refreshToken']
    );

    const { refresh_token, ...userDB } = result;
    this.addRefreshToken(refresh_token, res);

    res.status(HttpStatus.CREATED).send(userDB);
  }

  private addRefreshToken(refresh_token: string, @Res() res: Response) {
    res.cookie('refreshToken', refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: environment.production,
      httpOnly: true
    });
  }
}
