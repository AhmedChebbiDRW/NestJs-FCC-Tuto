import { Inject, Injectable } from '@nestjs/common';
import { DevConfigService } from './common/providers/dev-config.service';

@Injectable()
export class AppService {
  constructor(
    private devConfigService: DevConfigService,
    @Inject('CONFIG')
    private config: { port: number },
  ) {}
  getHello(): string {
    return `${this.devConfigService.getDBHOST()}:${this.config.port}`;
  }
}
