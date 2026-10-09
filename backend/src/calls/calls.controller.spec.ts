jest.mock('./calls.service', () => ({
  CallsService: class CallsService {},
}));

import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';

describe('CallsController', () => {
  const callsService = {
    buildWelcomeResponse: jest.fn().mockReturnValue('<Response />'),
    buildMenuResponse: jest.fn().mockReturnValue('<Response />'),
    buildRecordingCompleteResponse: jest.fn().mockReturnValue('<Response />'),
    handleRecordingAvailablePayload: jest.fn(),
  } as unknown as CallsService;

  const controller = new CallsController(callsService);

  it('returns welcome bxml', () => {
    expect(controller.incomingCall()).toBe('<Response />');
    expect(callsService.buildWelcomeResponse).toHaveBeenCalled();
  });

  it('passes menu digits through', () => {
    controller.menu({ digits: '1' });
    expect(callsService.buildMenuResponse).toHaveBeenCalledWith('1');
  });
});
