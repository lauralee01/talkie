import { Controller, Get } from '@nestjs/common';
import { TalkiesService } from './talkies.service';

@Controller('talkies')
export class TalkiesController {
    constructor(private readonly talkiesService: TalkiesService) { }

    @Get()
    async findAll() {
        return this.talkiesService.findAll();
    }
}