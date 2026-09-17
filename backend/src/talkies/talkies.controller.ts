import {
    Controller,
    Get,
    NotFoundException,
    Param,
    StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'node:fs';
import { TalkiesService } from './talkies.service';

@Controller('talkies')
export class TalkiesController {
    constructor(private readonly talkiesService: TalkiesService) { }

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
}