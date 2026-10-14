import {
  buildMenuBxml,
  buildRecordingCompleteBxml,
  buildWelcomeBxml,
  type CallFlowPrompts,
} from './talkie-bxml';

const prompts: CallFlowPrompts = {
  welcomePrompt: 'Welcome to Talkie. Press 1 to leave a message.',
  recordPrompt:
    'Leave your Talkie after the beep. Press pound when you are finished.',
  invalidOptionPrompt: 'Sorry, that option is not available.',
  goodbyePrompt: 'Your Talkie has been saved. Goodbye.',
  maxRecordingSeconds: 60,
};

describe('talkie-bxml', () => {
  it('builds a welcome gather prompt', () => {
    const bxml = buildWelcomeBxml(prompts);

    expect(bxml).toContain('Welcome to Talkie');
    expect(bxml).toContain('/calls/bandwidth/menu');
  });

  it('starts recording when digit 1 is pressed', () => {
    const bxml = buildMenuBxml('1', prompts);

    expect(bxml).toContain('Record');
    expect(bxml).toContain('/calls/bandwidth/recording-complete');
  });

  it('rejects unsupported menu digits', () => {
    const bxml = buildMenuBxml('9', prompts);

    expect(bxml).toContain('not available');
    expect(bxml).not.toContain('Record');
  });

  it('confirms recording completion', () => {
    expect(buildRecordingCompleteBxml(prompts)).toContain('saved');
  });

  it('uses custom prompts and max duration', () => {
    const custom: CallFlowPrompts = {
      ...prompts,
      welcomePrompt: 'Hello family line.',
      maxRecordingSeconds: 90,
    };

    expect(buildWelcomeBxml(custom)).toContain('Hello family line.');
    expect(buildMenuBxml('1', custom)).toContain('90');
  });
});
