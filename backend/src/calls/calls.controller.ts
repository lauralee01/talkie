import { Body, Controller, Header, HttpCode, Post } from '@nestjs/common';
import { CallsService } from './calls.service';
import { BandwidthMenuDto } from './dto/bandwidth-menu.dto';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post('bandwidth/incoming')
  @Header('Content-Type', 'application/xml')
  incomingCall(): string {
    return this.callsService.buildWelcomeResponse();
  }

  @Post('bandwidth/menu')
  @Header('Content-Type', 'application/xml')
  menu(@Body() body: BandwidthMenuDto): string {
    return this.callsService.buildMenuResponse(body.digits ?? '');
  }

  @Post('bandwidth/recording-complete')
  @Header('Content-Type', 'application/xml')
  recordingComplete(): string {
    return this.callsService.buildRecordingCompleteResponse();
  }

  @Post('bandwidth/recording-available')
  @HttpCode(204)
  async recordingAvailable(
    @Body() body: Record<string, unknown>,
  ): Promise<void> {
    await this.callsService.handleRecordingAvailablePayload(body);
  }
}
