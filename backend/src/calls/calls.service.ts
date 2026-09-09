import { Injectable } from '@nestjs/common';
import { twiml } from 'twilio';

@Injectable()
export class CallsService {

    buildWelcomeResponse(): string {
        const response = new twiml.VoiceResponse();

        const gather = response.gather({
            input: ['dtmf'],
            numDigits: 1,
            action: '/calls/menu',
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
}
