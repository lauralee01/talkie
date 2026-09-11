import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bxml } from 'bandwidth-sdk';

@Injectable()
export class CallsService {
    constructor(private readonly configService: ConfigService) { }

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
        const message =
            digits === '1'
                ? 'You chose to leave a message. Talkie is working.'
                : 'Sorry, that option is not available.';

        const speakSentence = new Bxml.SpeakSentence(message);

        const response = new Bxml.Response(speakSentence);

        return response.toBxml();
    }
}
