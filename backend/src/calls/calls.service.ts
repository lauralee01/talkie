import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bxml, Configuration, RecordingsApi } from 'bandwidth-sdk';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { TalkiesEventsService } from '../talkies/talkies-events/talkies-events.service';
import { TalkiesService } from '../talkies/talkies.service';


@Injectable()
export class CallsService {
    private readonly recordingsApi: RecordingsApi;
    private readonly bandwidthAccountId: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly talkiesService: TalkiesService,
        private readonly talkiesEventsService: TalkiesEventsService,
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

    private parseDurationSeconds(duration: unknown): number {
        if (typeof duration !== 'string') {
            return 0;
        }

        const match = duration.match(/^PT([\d.]+)S$/);

        if (!match) {
            return 0;
        }

        return Number(match[1]);
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

    async handleBandwidthRecordingAvailable(
        event: Record<string, unknown>,
    ): Promise<void> {
        console.log('Talkie recording available:', event);

        const callId = event.callId;
        const recordingId = event.recordingId;
        const fromNumber = event.from;
        const toNumber = event.to;
        const duration = event.duration;
        const fileFormat = event.fileFormat;

        if (
            typeof callId !== 'string' ||
            typeof recordingId !== 'string' ||
            typeof fromNumber !== 'string' ||
            typeof toNumber !== 'string' ||
            typeof fileFormat !== 'string'
        ) {
            console.error(
                'Bandwidth recording event is missing required fields',
            );
            return;
        }

        const durationSeconds = this.parseDurationSeconds(duration);

        try {
            const { data } =
                await this.recordingsApi.downloadCallRecording(
                    this.bandwidthAccountId,
                    callId,
                    recordingId,
                    {
                        responseType: 'arraybuffer',
                    },
                );

            const recordingsDirectory = join(
                process.cwd(),
                'recordings',
            );

            await mkdir(recordingsDirectory, {
                recursive: true,
            });

            const filePath = join(
                recordingsDirectory,
                `${recordingId}.wav`,
            );

            const audioBuffer = Buffer.from(
                data as unknown as ArrayBuffer,
            );

            await writeFile(filePath, audioBuffer);

            await this.talkiesService.upsert({
                callId,
                recordingId,
                fromNumber,
                toNumber,
                durationSeconds,
                fileFormat,
                audioPath: filePath,
                status: 'ready',
            });

            this.talkiesEventsService.notifyNewTalkie();

            console.log(
                'Talkie recording downloaded and persisted:',
                {
                    recordingId,
                    filePath,
                },
            );
        } catch (error: unknown) {
            console.error(
                'Failed to process Talkie recording:',
                {
                    callId,
                    recordingId,
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                },
            );
        }
    }
}
