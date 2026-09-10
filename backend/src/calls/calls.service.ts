import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { twiml } from 'twilio';

@Injectable()
export class CallsService {
    constructor(private readonly configService: ConfigService) { }

    buildWelcomeResponse(): string {
        const response = new twiml.VoiceResponse();

        const publicNgrokBaseUrl =
            this.configService.getOrThrow<string>('PUBLIC_NGROK_BASE_URL');

        const gather = response.gather({
            input: ['dtmf'],
            numDigits: 1,
            action: `${publicNgrokBaseUrl}/calls/menu`,
            method: 'POST',
        });

        gather.say(
            'Welcome to Talkie. Press 1 to leave a message.',
        );

        response.say(
            'We did not receive a selection. Goodbye.',
        );

        return response.toString();
    }

    buildMenuResponse(digits: string): string {
        const response = new twiml.VoiceResponse();

        if (digits === '1') {
            const publicBaseUrl =
                this.configService.getOrThrow<string>('PUBLIC_NGROK_BASE_URL');

            response.say(
                'Leave your Talkie after the beep. Press pound when you are finished.',
            );

            response.record({
                action: `${publicBaseUrl}/calls/recording-complete`,
                method: 'POST',
                finishOnKey: '#',
                maxLength: 60,
                playBeep: true,
            });

            return response.toString();
        }

        response.say(
            'Sorry, that option is not available.',
        );

        response.hangup();

        return response.toString();
    }
}
