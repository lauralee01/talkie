import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  AUTH_SESSION_COOKIE,
  AUTH_SESSION_MAX_AGE_MS,
} from './auth.constants';
import { AuthGuard, type AuthenticatedRequest } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.login(body.email, body.password);
    const token = this.authService.createSessionToken(user);

    response.cookie(AUTH_SESSION_COOKIE, token, this.cookieOptions());

    return user;
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie(AUTH_SESSION_COOKIE, this.cookieOptions());
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() request: AuthenticatedRequest) {
    return request.user;
  }

  private cookieOptions() {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: isProduction,
      path: '/',
      maxAge: AUTH_SESSION_MAX_AGE_MS,
    };
  }
}
