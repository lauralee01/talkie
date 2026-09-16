import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TalkiesService } from './talkies.service';

@Module({
  imports: [PrismaModule],
  providers: [TalkiesService],
  exports: [TalkiesService],
})
export class TalkiesModule { }