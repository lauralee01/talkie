import { Module } from '@nestjs/common';
import { BandwidthCallbackGuard } from './bandwidth-callback.guard';
import { BandwidthService } from './bandwidth.service';

@Module({
  providers: [BandwidthService, BandwidthCallbackGuard],
  exports: [BandwidthService, BandwidthCallbackGuard],
})
export class BandwidthModule {}

