import { Injectable } from '@nestjs/common';
import { Subject, merge, timer } from 'rxjs';
import { map } from 'rxjs/operators';

export type TalkieLiveEvent = {
  type: 'talkie.changed' | 'heartbeat';
};

const HEARTBEAT_MS = 25_000;

@Injectable()
export class TalkiesEventsService {
  private readonly newTalkieSubject = new Subject<void>();

  readonly newTalkie$ = this.newTalkieSubject.asObservable();

  readonly live$ = merge(
    this.newTalkieSubject.pipe(
      map((): TalkieLiveEvent => ({ type: 'talkie.changed' })),
    ),
    timer(0, HEARTBEAT_MS).pipe(
      map((): TalkieLiveEvent => ({ type: 'heartbeat' })),
    ),
  );

  notifyNewTalkie(): void {
    this.newTalkieSubject.next();
  }
}
