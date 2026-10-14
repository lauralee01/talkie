import { Bxml } from 'bandwidth-sdk';

export type CallFlowPrompts = {
  welcomePrompt: string;
  recordPrompt: string;
  invalidOptionPrompt: string;
  goodbyePrompt: string;
  maxRecordingSeconds: number;
};

export function buildWelcomeBxml(prompts: CallFlowPrompts): string {
  const speakSentence = new Bxml.SpeakSentence(prompts.welcomePrompt);

  const gather = new Bxml.Gather(
    {
      gatherUrl: '/calls/bandwidth/menu',
      maxDigits: 1,
    },
    [speakSentence],
  );

  return new Bxml.Response(gather).toBxml();
}

export function buildMenuBxml(
  digits: string,
  prompts: CallFlowPrompts,
): string {
  if (digits !== '1') {
    return new Bxml.Response(
      new Bxml.SpeakSentence(prompts.invalidOptionPrompt),
    ).toBxml();
  }

  const speakSentence = new Bxml.SpeakSentence(prompts.recordPrompt);

  const record = new Bxml.Record({
    recordCompleteUrl: '/calls/bandwidth/recording-complete',
    recordingAvailableUrl: '/calls/bandwidth/recording-available',
    terminatingDigits: '#',
    maxDuration: prompts.maxRecordingSeconds,
    fileFormat: 'wav',
  });

  return new Bxml.Response([speakSentence, record]).toBxml();
}

export function buildRecordingCompleteBxml(prompts: CallFlowPrompts): string {
  return new Bxml.Response(
    new Bxml.SpeakSentence(prompts.goodbyePrompt),
  ).toBxml();
}
