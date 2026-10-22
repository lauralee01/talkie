import { Module } from '@nestjs/common';
import { TalkiesModule } from '../talkies/talkies.module';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
  imports: [TalkiesModule],
  providers: [ContactsService],
  exports: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {}
