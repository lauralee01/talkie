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
  Post,
  Query,
  Sse,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { Observable, map } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { getAudioMimeType } from '../common/utils/audio-mime';
import { ListTalkiesQueryDto } from './dto/list-talkies-query.dto';
import { TalkiesEventsService } from './talkies-events.service';
import { TalkiesService } from './talkies.service';

@Controller('talkies')
@UseGuards(AuthGuard)
export class TalkiesController {
  private readonly logger = new Logger(TalkiesController.name);

  constructor(
    private readonly talkiesService: TalkiesService,
    private readonly talkiesEventsService: TalkiesEventsService,
  ) {}

  @Get()
  findPage(@Query() query: ListTalkiesQueryDto) {
    return this.talkiesService.findPage(query.page, query.pageSize);
  }

  @Sse('events')
  events(): Observable<MessageEvent> {
    this.logger.debug('SSE client connected');

    return this.talkiesEventsService.live$.pipe(
      map((event) => ({
        data: event,
      })),
    );
  }

  @Post('listened')
  markAllListened() {
    return this.talkiesService.markAllListened();
  }

  @Get(':id/audio')
  async getAudio(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StreamableFile> {
    const talkie = await this.talkiesService.findById(id);

    if (!talkie) {
      throw new NotFoundException('Talkie not found');
    }

    let fileSize: number;
    try {
      const fileStat = await stat(talkie.audioPath);
      fileSize = fileStat.size;
    } catch {
      throw new NotFoundException('Talkie audio file not found');
    }

    const extension = talkie.fileFormat.replace(/^\./, '') || 'wav';

    return new StreamableFile(createReadStream(talkie.audioPath), {
      type: getAudioMimeType(talkie.fileFormat),
      disposition: `inline; filename="talkie-${talkie.id}.${extension}"`,
      length: fileSize,
    });
  }

  @Post(':id/listened')
  markListened(@Param('id', ParseUUIDPipe) id: string) {
    return this.talkiesService.markListened(id);
  }

  @Post(':id/unread')
  markUnread(@Param('id', ParseUUIDPipe) id: string) {
    return this.talkiesService.markUnread(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.talkiesService.delete(id);
  }
}
