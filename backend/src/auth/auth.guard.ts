import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AUTH_SESSION_COOKIE } from './auth.constants';
import { AuthService } from './auth.service';
import type { AuthUser } from './auth.types';

export type AuthenticatedRequest = Request & {
  user?: AuthUser;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.[AUTH_SESSION_COOKIE] as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Authentication required.');
    }

    request.user = this.authService.verifySessionToken(token);
    return true;
  }
}
