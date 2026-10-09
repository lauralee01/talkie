jest.mock('../bandwidth/bandwidth.service', () => ({
  BandwidthService: class BandwidthService {},
}));
jest.mock('../recordings/recordings-storage.service', () => ({
  RecordingsStorageService: class RecordingsStorageService {},
}));
jest.mock('../talkies/talkies.service', () => ({
  TalkiesService: class TalkiesService {},
}));
jest.mock('../contacts/contacts.service', () => ({
  ContactsService: class ContactsService {},
}));

import { CallsService } from './calls.service';

describe('CallsService', () => {
  const service = new CallsService(
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  );

  it('builds welcome bxml', () => {
    expect(service.buildWelcomeResponse()).toContain('SpeakSentence');
  });

  it('builds menu bxml for digit 1', () => {
    expect(service.buildMenuResponse('1')).toContain('Record');
  });

  it('ignores invalid recording payloads', async () => {
    await expect(
      service.handleRecordingAvailablePayload({ callId: 'only-id' }),
    ).resolves.toBeUndefined();
  });
});
