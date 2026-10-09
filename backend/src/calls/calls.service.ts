import { Injectable, Logger } from '@nestjs/common';
import { BandwidthService } from '../bandwidth/bandwidth.service';
import { parseDurationSeconds } from '../common/utils/duration';
import { normalizePhoneNumber } from '../common/utils/phone-number';
import { ContactsService } from '../contacts/contacts.service';
import { RecordingsStorageService } from '../recordings/recordings-storage.service';
import { TalkiesService } from '../talkies/talkies.service';
import {
  BandwidthRecordingAvailableEvent,
  parseRecordingAvailableEvent,
} from './bandwidth-recording.parser';
import {
  buildMenuBxml,
  buildRecordingCompleteBxml,
  buildWelcomeBxml,
} from './talkie-bxml';

@Injectable()
export class CallsService {
  private readonly logger = new Logger(CallsService.name);

  constructor(
    private readonly bandwidthService: BandwidthService,
    private readonly recordingsStorage: RecordingsStorageService,
    private readonly talkiesService: TalkiesService,
    private readonly contactsService: ContactsService,
  ) {}

  buildWelcomeResponse(): string {
    return buildWelcomeBxml();
  }

  buildMenuResponse(digits: string): string {
    return buildMenuBxml(digits);
  }

  buildRecordingCompleteResponse(): string {
    return buildRecordingCompleteBxml();
  }

  async handleRecordingAvailablePayload(
    body: Record<string, unknown>,
  ): Promise<void> {
    const event = parseRecordingAvailableEvent(body);

    if (!event) {
      this.logger.error(
        'Bandwidth recording event is missing required fields',
        body,
      );
      return;
    }

    await this.persistRecording(event);
  }

  private async persistRecording(
    event: BandwidthRecordingAvailableEvent,
  ): Promise<void> {
    const {
      callId,
      recordingId,
      from: fromNumber,
      to: toNumber,
      fileFormat,
      duration,
    } = event;

    const durationSeconds = parseDurationSeconds(duration);
    const normalizedFromNumber = normalizePhoneNumber(fromNumber) ?? fromNumber;

    const contact =
      await this.contactsService.findByPhoneNumber(normalizedFromNumber);

    try {
      const audioBuffer = await this.bandwidthService.downloadRecording(
        callId,
        recordingId,
      );

      const audioPath = await this.recordingsStorage.save(
        recordingId,
        fileFormat,
        audioBuffer,
      );

      await this.talkiesService.upsert({
        callId,
        recordingId,
        fromNumber: normalizedFromNumber,
        toNumber,
        durationSeconds,
        fileFormat,
        audioPath,
        status: 'ready',
        contactId: contact?.id,
      });

      this.logger.log(`Recording saved: ${recordingId}`);
    } catch (error: unknown) {
      this.logger.error('Failed to process Talkie recording', {
        callId,
        recordingId,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
