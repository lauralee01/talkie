import { Body, Controller, Header, Post } from '@nestjs/common';
import { CallsService } from './calls.service';

@Controller('calls')
export class CallsController {
    constructor(private readonly callsService: CallsService) { }

    @Post('incoming')
    @Header('Content-Type', 'text/xml')
    incomingCall(): string {
        return this.callsService.buildWelcomeResponse();
    }

    @Post('menu')
    @Header('Content-Type', 'text/xml')
    handleMenu(@Body('Digits') digits: string): string {
        return this.callsService.buildMenuResponse(digits);
    }

    @Post('recording-complete')
    @Header('Content-Type', 'text/xml')
    recordingComplete(
        @Body('RecordingUrl') recordingUrl: string,
        @Body('RecordingSid') recordingSid: string,
        @Body('RecordingDuration') recordingDuration: string,
    ): string {
        return this.callsService.buildRecordingCompleteResponse(
            recordingUrl,
            recordingSid,
            recordingDuration,
        );
    }

    @Post('bandwidth/incoming')
    @Header('Content-Type', 'application/xml')
    bandwidthIncomingCall(): string {
        return this.callsService.buildBandwidthWelcomeResponse();
    }

}
