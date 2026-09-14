import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bxml, Configuration, RecordingsApi } from 'bandwidth-sdk';

@Injectable()
export class CallsService {
    private readonly recordingsApi: RecordingsApi;
    private readonly bandwidthAccountId: string;
    constructor(
        private readonly configService: ConfigService,
    ) {
        const clientId =
            this.configService.getOrThrow<string>('BANDWIDTH_CLIENT_ID');

        const clientSecret =
            this.configService.getOrThrow<string>('BANDWIDTH_CLIENT_SECRET');

        this.bandwidthAccountId =
            this.configService.getOrThrow<string>('BANDWIDTH_ACCOUNT_ID');

        const bandwidthConfig = new Configuration({
            clientId,
            clientSecret,
        });

        this.recordingsApi = new RecordingsApi(bandwidthConfig);
    }

    buildBandwidthWelcomeResponse(): string {
        const speakSentence = new Bxml.SpeakSentence(
            'Welcome to Talkie. Press 1 to leave a message.',
        );

        const gather = new Bxml.Gather(
            {
                gatherUrl: '/calls/bandwidth/menu',
                maxDigits: 1,
            },
            [speakSentence],
        );

        const response = new Bxml.Response(gather);

        return response.toBxml();
    }

    buildBandwidthMenuResponse(digits: string): string {
        if (digits !== '1') {
            const speakSentence = new Bxml.SpeakSentence(
                'Sorry, that option is not available.',
            );

            const response = new Bxml.Response(speakSentence);

            return response.toBxml();
        }

        const speakSentence = new Bxml.SpeakSentence(
            'Leave your Talkie after the beep. Press pound when you are finished.',
        );

        const record = new Bxml.Record({
            recordCompleteUrl: '/calls/bandwidth/recording-complete',
            recordingAvailableUrl: '/calls/bandwidth/recording-available',
            terminatingDigits: '#',
            maxDuration: 60,
            fileFormat: 'wav',
        });

        const response = new Bxml.Response([
            speakSentence,
            record,
        ]);

        return response.toBxml();
    }

    buildBandwidthRecordingCompleteResponse(
        event: Record<string, unknown>,
    ): string {
        console.log('Talkie recording complete:', event);

        const speakSentence = new Bxml.SpeakSentence(
            'Your Talkie has been saved. Goodbye.',
        );

        const response = new Bxml.Response(speakSentence);

        return response.toBxml();
    }

    handleBandwidthRecordingAvailable(
        event: Record<string, unknown>,
    ): void {
        console.log('Talkie recording available:', event);
    }
}
