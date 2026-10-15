import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';

@Injectable()
export class BandwidthCallbackGuard implements CanActivate {
  private readonly logger = new Logger(BandwidthCallbackGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const username = process.env.BANDWIDTH_CALLBACK_USERNAME?.trim();
    const password = process.env.BANDWIDTH_CALLBACK_PASSWORD;

    if (!username || !password) {
      this.logger.warn(
        'BANDWIDTH_CALLBACK_USERNAME/PASSWORD not set; Bandwidth callbacks are unauthenticated.',
      );
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const header = request.headers.authorization;

    if (!header?.startsWith('Basic ')) {
      this.challenge(response);
      throw new UnauthorizedException('Authentication required.');
    }

    let decoded: string;
    try {
      decoded = Buffer.from(header.slice('Basic '.length), 'base64').toString(
        'utf8',
      );
    } catch {
      this.challenge(response);
      throw new UnauthorizedException('Invalid authorization header.');
    }

    const separator = decoded.indexOf(':');
    if (separator < 0) {
      this.challenge(response);
      throw new UnauthorizedException('Invalid authorization header.');
    }

    const providedUser = decoded.slice(0, separator);
    const providedPassword = decoded.slice(separator + 1);

    if (
      !safeEqual(providedUser, username) ||
      !safeEqual(providedPassword, password)
    ) {
      this.challenge(response);
      throw new UnauthorizedException('Invalid credentials.');
    }

    return true;
  }

  private challenge(response: Response) {
    response.setHeader('WWW-Authenticate', 'Basic realm="Talkie"');
  }
}

function safeEqual(a: string, b: string): boolean {
  const digestA = createHash('sha256').update(a).digest();
  const digestB = createHash('sha256').update(b).digest();
  return timingSafeEqual(digestA, digestB) && a.length === b.length;
}
