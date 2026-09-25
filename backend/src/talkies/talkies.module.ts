import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TalkiesService } from './talkies.service';
import { TalkiesController } from './talkies.controller';
import { TalkiesEventsService } from './talkies-events/talkies-events.service';

@Module({
  imports: [PrismaModule],
  providers: [TalkiesService, TalkiesEventsService],
  exports: [TalkiesService, TalkiesEventsService],
  controllers: [TalkiesController],
})
export class TalkiesModule { }