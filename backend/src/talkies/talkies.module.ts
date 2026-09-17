import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TalkiesService } from './talkies.service';
import { TalkiesController } from './talkies.controller';

@Module({
  imports: [PrismaModule],
  providers: [TalkiesService],
  exports: [TalkiesService],
  controllers: [TalkiesController],
})
export class TalkiesModule { }