import { Body, Controller, Header, Post } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
    constructor(private readonly callsService: CallsService) { }

    @Post('bandwidth/incoming')
    @Header('Content-Type', 'application/xml')
    bandwidthIncomingCall(): string {
        return this.callsService.buildBandwidthWelcomeResponse();
    }

    @Post('bandwidth/menu')
    @Header('Content-Type', 'application/xml')
    bandwidthMenu(@Body() body: { digits?: string }): string {
        return this.callsService.buildBandwidthMenuResponse(body.digits ?? '');
    }

}
