import { Injectable } from '@nestjs/common';
import { RequestTimeoutException } from '@nestjs/common';

@Injectable()
export class DatabaseErrorService {
  static throwError(action: string): never {
    throw new RequestTimeoutException(
      'Unable to process your request at the moment, please try later',
      { description: `Error while ${action}` },
    );
  }
  static saveError(action: string): never {
    throw new RequestTimeoutException(
      'Unable to process your request at the moment, please try later',
      {
        description: `Error while ${action} (saving to DB)`,
      },
    );
  }
}
