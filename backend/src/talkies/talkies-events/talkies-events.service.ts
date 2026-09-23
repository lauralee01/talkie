import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class TalkiesEventsService {
    private readonly newTalkieSubject = new Subject<void>();

    readonly newTalkie$ = this.newTalkieSubject.asObservable();

    notifyNewTalkie(): void {
        this.newTalkieSubject.next();
    }
}
