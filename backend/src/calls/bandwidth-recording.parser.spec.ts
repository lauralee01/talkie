import { parseRecordingAvailableEvent } from './bandwidth-recording.parser';

describe('parseRecordingAvailableEvent', () => {
  it('parses a valid payload', () => {
    expect(
      parseRecordingAvailableEvent({
        callId: 'call-1',
        recordingId: 'rec-1',
        from: '+12055551234',
        to: '+12055555678',
        fileFormat: 'wav',
        duration: 'PT3.5S',
      }),
    ).toEqual({
      callId: 'call-1',
      recordingId: 'rec-1',
      from: '+12055551234',
      to: '+12055555678',
      fileFormat: 'wav',
      duration: 'PT3.5S',
    });
  });

  it('returns null when required fields are missing', () => {
    expect(
      parseRecordingAvailableEvent({
        callId: 'call-1',
      }),
    ).toBeNull();
  });
});
