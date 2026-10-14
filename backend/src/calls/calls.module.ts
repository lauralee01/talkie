import { Module } from '@nestjs/common';
import { BandwidthModule } from '../bandwidth/bandwidth.module';
import { ContactsModule } from '../contacts/contacts.module';
import { RecordingsModule } from '../recordings/recordings.module';
import { SettingsModule } from '../settings/settings.module';
import { TalkiesModule } from '../talkies/talkies.module';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';

@Module({
  imports: [
    BandwidthModule,
    ContactsModule,
    RecordingsModule,
    SettingsModule,
    TalkiesModule,
  ],
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule {}
