import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      throw new ServiceUnavailableException({
        service: 'talkie-api',
        status: 'error',
        database: 'unavailable',
      });
    }

    return {
      service: 'talkie-api',
      status: 'ok',
      database: 'ok',
    };
  }
}
