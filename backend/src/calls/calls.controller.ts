import { Controller, Header, Post } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
    constructor(private readonly callsService: CallsService) { }

    @Post('incoming')
    @Header('Content-Type', 'text/xml')
    incomingCall(): string {
        return this.callsService.buildWelcomeResponse();
    }
}
