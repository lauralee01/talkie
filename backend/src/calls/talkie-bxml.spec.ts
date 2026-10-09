import {
  buildMenuBxml,
  buildRecordingCompleteBxml,
  buildWelcomeBxml,
} from './talkie-bxml';

describe('talkie-bxml', () => {
  it('builds a welcome gather prompt', () => {
    const bxml = buildWelcomeBxml();

    expect(bxml).toContain('Welcome to Talkie');
    expect(bxml).toContain('/calls/bandwidth/menu');
  });

  it('starts recording when digit 1 is pressed', () => {
    const bxml = buildMenuBxml('1');

    expect(bxml).toContain('Record');
    expect(bxml).toContain('/calls/bandwidth/recording-complete');
  });

  it('rejects unsupported menu digits', () => {
    const bxml = buildMenuBxml('9');

    expect(bxml).toContain('not available');
    expect(bxml).not.toContain('Record');
  });

  it('confirms recording completion', () => {
    expect(buildRecordingCompleteBxml()).toContain('saved');
  });
});
