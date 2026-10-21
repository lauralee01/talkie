jest.mock('./prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  const prisma = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    prisma.$queryRaw.mockReset();
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('returns ok when the database responds', async () => {
      await expect(appController.getHealth()).resolves.toEqual({
        service: 'talkie-api',
        status: 'ok',
        database: 'ok',
      });
    });

    it('returns unavailable when the database is down', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

      await expect(appController.getHealth()).rejects.toBeInstanceOf(
        ServiceUnavailableException,
      );
    });
  });
});
