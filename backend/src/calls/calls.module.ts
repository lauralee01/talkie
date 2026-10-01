import { Module } from '@nestjs/common';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { TalkiesModule } from '../talkies/talkies.module';
import { ContactsModule } from 'src/contacts/contacts.module';

@Module({
  imports: [TalkiesModule, ContactsModule],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule { }
