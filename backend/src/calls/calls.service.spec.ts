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
jest.mock('../settings/settings.service', () => ({
  SettingsService: class SettingsService {},
}));

import { CallsService } from './calls.service';

const settings = {
  id: 'default',
  welcomePrompt: 'Welcome to Talkie. Press 1 to leave a message.',
  recordPrompt:
    'Leave your Talkie after the beep. Press pound when you are finished.',
  invalidOptionPrompt: 'Sorry, that option is not available.',
  goodbyePrompt: 'Your Talkie has been saved. Goodbye.',
  maxRecordingSeconds: 60,
  updatedAt: new Date(),
};

describe('CallsService', () => {
  const settingsService = {
    get: jest.fn().mockResolvedValue(settings),
  };

  const service = new CallsService(
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    settingsService as never,
  );

  it('builds welcome bxml', async () => {
    await expect(service.buildWelcomeResponse()).resolves.toContain(
      'SpeakSentence',
    );
  });

  it('builds menu bxml for digit 1', async () => {
    await expect(service.buildMenuResponse('1')).resolves.toContain('Record');
  });

  it('ignores invalid recording payloads', async () => {
    await expect(
      service.handleRecordingAvailablePayload({ callId: 'only-id' }),
    ).resolves.toBeUndefined();
  });
});
