import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      service: 'talkie-api',
      status: 'ok',
    };
  }
}
