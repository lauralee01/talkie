import { UnauthorizedException } from '@nestjs/common';
import { BandwidthCallbackGuard } from './bandwidth-callback.guard';

describe('BandwidthCallbackGuard', () => {
  const originalUsername = process.env.BANDWIDTH_CALLBACK_USERNAME;
  const originalPassword = process.env.BANDWIDTH_CALLBACK_PASSWORD;

  afterEach(() => {
    if (originalUsername === undefined) {
      delete process.env.BANDWIDTH_CALLBACK_USERNAME;
    } else {
      process.env.BANDWIDTH_CALLBACK_USERNAME = originalUsername;
    }

    if (originalPassword === undefined) {
      delete process.env.BANDWIDTH_CALLBACK_PASSWORD;
    } else {
      process.env.BANDWIDTH_CALLBACK_PASSWORD = originalPassword;
    }
  });

  function createContext(authorization?: string) {
    const headers: Record<string, string | undefined> = {
      authorization,
    };
    const responseHeaders: Record<string, string> = {};

    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
        getResponse: () => ({
          setHeader: (name: string, value: string) => {
            responseHeaders[name] = value;
          },
        }),
      }),
      responseHeaders,
    };
  }

  it('allows requests when callback credentials are not configured', () => {
    delete process.env.BANDWIDTH_CALLBACK_USERNAME;
    delete process.env.BANDWIDTH_CALLBACK_PASSWORD;

    const guard = new BandwidthCallbackGuard();
    const context = createContext();

    expect(guard.canActivate(context as never)).toBe(true);
  });

  it('challenges when credentials are configured but Authorization is missing', () => {
    process.env.BANDWIDTH_CALLBACK_USERNAME = 'talkie';
    process.env.BANDWIDTH_CALLBACK_PASSWORD = 'secret';

    const guard = new BandwidthCallbackGuard();
    const context = createContext();

    expect(() => guard.canActivate(context as never)).toThrow(
      UnauthorizedException,
    );
    expect(context.responseHeaders['WWW-Authenticate']).toBe(
      'Basic realm="Talkie"',
    );
  });

  it('rejects invalid credentials', () => {
    process.env.BANDWIDTH_CALLBACK_USERNAME = 'talkie';
    process.env.BANDWIDTH_CALLBACK_PASSWORD = 'secret';

    const guard = new BandwidthCallbackGuard();
    const context = createContext(
      `Basic ${Buffer.from('talkie:wrong').toString('base64')}`,
    );

    expect(() => guard.canActivate(context as never)).toThrow(
      UnauthorizedException,
    );
  });

  it('allows valid basic credentials', () => {
    process.env.BANDWIDTH_CALLBACK_USERNAME = 'talkie';
    process.env.BANDWIDTH_CALLBACK_PASSWORD = 'secret';

    const guard = new BandwidthCallbackGuard();
    const context = createContext(
      `Basic ${Buffer.from('talkie:secret').toString('base64')}`,
    );

    expect(guard.canActivate(context as never)).toBe(true);
  });
});
