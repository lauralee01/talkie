import { Module } from '@nestjs/common';
import { TalkiesController } from './talkies.controller';
import { TalkiesEventsService } from './talkies-events.service';
import { TalkiesService } from './talkies.service';

@Module({
  providers: [TalkiesService, TalkiesEventsService],
  exports: [TalkiesService, TalkiesEventsService],
  controllers: [TalkiesController],
})
export class TalkiesModule {}
