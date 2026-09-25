import {
    Controller,
    Get,
    MessageEvent,
    NotFoundException,
    Param,
    Sse,
    StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'node:fs';
import { Observable, map } from 'rxjs';
import { TalkiesEventsService } from './talkies-events/talkies-events.service';
import { TalkiesService } from './talkies.service';

@Controller('talkies')
export class TalkiesController {
    constructor(private readonly talkiesService: TalkiesService, private readonly talkiesEventsService: TalkiesEventsService) { }

    @Get()
    async findAll() {
        return this.talkiesService.findAll();
    }

    @Get(':id/audio')
    async getAudio(
        @Param('id') id: string,
    ): Promise<StreamableFile> {
        const talkie = await this.talkiesService.findById(id);

        if (!talkie) {
            throw new NotFoundException('Talkie not found');
        }

        if (!existsSync(talkie.audioPath)) {
            throw new NotFoundException('Talkie audio file not found');
        }

        const audioStream = createReadStream(talkie.audioPath);

        return new StreamableFile(audioStream, {
            type: 'audio/wav',
        });
    }

    // @Sse('events')
    // events(): Observable<MessageEvent> {
    //     return this.talkiesEventsService.newTalkie$.pipe(
    //         map(() => ({
    //             data: {
    //                 type: 'talkie.created',
    //             },
    //         })),
    //     );
    // }
    @Sse('events')
    events(): Observable<MessageEvent> {
        console.log('SSE client connected');

        return this.talkiesEventsService.newTalkie$.pipe(
            map(() => {
                console.log('Sending talkie.created SSE event');

                return {
                    data: {
                        type: 'talkie.created',
                    },
                };
            }),
        );
    }
}