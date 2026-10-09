import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, RecordingsApi } from 'bandwidth-sdk';

@Injectable()
export class BandwidthService {
  private readonly recordingsApi: RecordingsApi;
  private readonly accountId: string;

  constructor(private readonly configService: ConfigService) {
    const clientId = this.configService.getOrThrow<string>(
      'BANDWIDTH_CLIENT_ID',
    );
    const clientSecret = this.configService.getOrThrow<string>(
      'BANDWIDTH_CLIENT_SECRET',
    );

    this.accountId = this.configService.getOrThrow<string>(
      'BANDWIDTH_ACCOUNT_ID',
    );

    this.recordingsApi = new RecordingsApi(
      new Configuration({ clientId, clientSecret }),
    );
  }

  async downloadRecording(
    callId: string,
    recordingId: string,
  ): Promise<Buffer> {
    const { data } = await this.recordingsApi.downloadCallRecording(
      this.accountId,
      callId,
      recordingId,
      { responseType: 'arraybuffer' },
    );

    return Buffer.from(data as unknown as ArrayBuffer);
  }
}
