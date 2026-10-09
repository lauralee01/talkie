import { Bxml } from 'bandwidth-sdk';

export function buildWelcomeBxml(): string {
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

  return new Bxml.Response(gather).toBxml();
}

export function buildMenuBxml(digits: string): string {
  if (digits !== '1') {
    return new Bxml.Response(
      new Bxml.SpeakSentence('Sorry, that option is not available.'),
    ).toBxml();
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

  return new Bxml.Response([speakSentence, record]).toBxml();
}

export function buildRecordingCompleteBxml(): string {
  return new Bxml.Response(
    new Bxml.SpeakSentence('Your Talkie has been saved. Goodbye.'),
  ).toBxml();
}
