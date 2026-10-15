import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_SESSION_MAX_AGE_MS } from './auth.constants';
import type { AuthUser, SessionPayload } from './auth.types';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.ensureOwner();
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    return this.toAuthUser(user);
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toAuthUser(user) : null;
  }

  createSessionToken(user: AuthUser): string {
    const payload: SessionPayload = {
      sub: user.id,
      email: user.email,
    };

    return sign(payload, this.getSecret(), {
      expiresIn: Math.floor(AUTH_SESSION_MAX_AGE_MS / 1000),
    });
  }

  async verifySessionToken(token: string): Promise<AuthUser> {
    try {
      const payload = verify(token, this.getSecret()) as SessionPayload;
      const user = await this.getUserById(payload.sub);

      if (!user || user.email !== payload.email) {
        throw new UnauthorizedException('Invalid session.');
      }

      return user;
    } catch {
      throw new UnauthorizedException('Invalid session.');
    }
  }

  private async ensureOwner() {
    const email = this.configService.get<string>('AUTH_EMAIL')?.trim();
    const password = this.configService.get<string>('AUTH_PASSWORD');

    if (!email || !password) {
      throw new Error(
        'AUTH_EMAIL and AUTH_PASSWORD must be set to bootstrap the owner account.',
      );
    }

    this.getSecret();

    const passwordHash = await bcrypt.hash(password, 12);

    await this.prisma.user.upsert({
      where: { id: 'owner' },
      create: {
        id: 'owner',
        email: email.toLowerCase(),
        passwordHash,
      },
      update: {
        email: email.toLowerCase(),
        passwordHash,
      },
    });

    this.logger.log(`Owner account ready (${email.toLowerCase()})`);
  }

  private getSecret(): string {
    const secret = this.configService.get<string>('AUTH_SECRET')?.trim();

    if (!secret || secret.length < 16) {
      throw new Error(
        'AUTH_SECRET must be set to a string at least 16 characters long.',
      );
    }

    return secret;
  }

  private toAuthUser(user: { id: string; email: string }): AuthUser {
    return { id: user.id, email: user.email };
  }
}
