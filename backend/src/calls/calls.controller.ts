import {
  Body,
  Controller,
  Header,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BandwidthCallbackGuard } from '../bandwidth/bandwidth-callback.guard';
import { CallsService } from './calls.service';
import { BandwidthMenuDto } from './dto/bandwidth-menu.dto';

@Controller('calls')
@UseGuards(BandwidthCallbackGuard)
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post('bandwidth/incoming')
  @Header('Content-Type', 'application/xml')
  incomingCall(): Promise<string> {
    return this.callsService.buildWelcomeResponse();
  }

  @Post('bandwidth/menu')
  @Header('Content-Type', 'application/xml')
  menu(@Body() body: BandwidthMenuDto): Promise<string> {
    return this.callsService.buildMenuResponse(body.digits ?? '');
  }

  @Post('bandwidth/recording-complete')
  @Header('Content-Type', 'application/xml')
  recordingComplete(): Promise<string> {
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
