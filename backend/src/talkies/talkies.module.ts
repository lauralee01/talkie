import { Module } from '@nestjs/common';
import { RecordingsModule } from '../recordings/recordings.module';
import { TalkiesController } from './talkies.controller';
import { TalkiesEventsService } from './talkies-events.service';
import { TalkiesService } from './talkies.service';

@Module({
  imports: [RecordingsModule],
  providers: [TalkiesService, TalkiesEventsService],
  exports: [TalkiesService, TalkiesEventsService],
  controllers: [TalkiesController],
})
export class TalkiesModule {}
