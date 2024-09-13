import { Injectable } from '@nestjs/common';

@Injectable()
export class DevConfigService {
  DBHOST = 'localhost';

  getDBHOST(): string {
    return this.DBHOST;
  }
}
