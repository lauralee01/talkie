jest.mock('./calls.service', () => ({
  CallsService: class CallsService {},
}));

import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';

describe('CallsController', () => {
  const callsService = {
    buildWelcomeResponse: jest.fn().mockResolvedValue('<Response />'),
    buildMenuResponse: jest.fn().mockResolvedValue('<Response />'),
    buildRecordingCompleteResponse: jest.fn().mockResolvedValue('<Response />'),
    handleRecordingAvailablePayload: jest.fn(),
  } as unknown as CallsService;

  const controller = new CallsController(callsService);

  it('returns welcome bxml', async () => {
    await expect(controller.incomingCall()).resolves.toBe('<Response />');
    expect(callsService.buildWelcomeResponse).toHaveBeenCalled();
  });

  it('passes menu digits through', async () => {
    await controller.menu({ digits: '1' });
    expect(callsService.buildMenuResponse).toHaveBeenCalledWith('1');
  });
});
