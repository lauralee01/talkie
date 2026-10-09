import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  MessageEvent,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Sse,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'node:fs';
import { Observable, map } from 'rxjs';
import { getAudioMimeType } from '../common/utils/audio-mime';
import { TalkiesEventsService } from './talkies-events.service';
import { TalkiesService } from './talkies.service';

@Controller('talkies')
export class TalkiesController {
  private readonly logger = new Logger(TalkiesController.name);

  constructor(
    private readonly talkiesService: TalkiesService,
    private readonly talkiesEventsService: TalkiesEventsService,
  ) {}

  @Get()
  findAll() {
    return this.talkiesService.findAll();
  }

  @Sse('events')
  events(): Observable<MessageEvent> {
    this.logger.debug('SSE client connected');

    return this.talkiesEventsService.newTalkie$.pipe(
      map(() => ({
        data: { type: 'talkie.changed' },
      })),
    );
  }

  @Get(':id/audio')
  async getAudio(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const talkie = await this.talkiesService.findById(id);

    if (!talkie) {
      throw new NotFoundException('Talkie not found');
    }

    if (!existsSync(talkie.audioPath)) {
      throw new NotFoundException('Talkie audio file not found');
    }

    return new StreamableFile(createReadStream(talkie.audioPath), {
      type: getAudioMimeType(talkie.fileFormat),
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.talkiesService.delete(id);
  }
}
