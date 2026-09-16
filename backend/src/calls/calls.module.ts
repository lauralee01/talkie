import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { TalkiesModule } from '../talkies/talkies.module';

@Module({
  imports: [TalkiesModule],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule { }
