import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-user.dto';

@Injectable()
export class UserService {
  getUsers(): string {
    return 'this is a users service';
  }

  findAll(id: GetUsersParamDto, limit: number, page: number) {
    return [
      { firstName: 'John', email: 'john@doe.com' },
      { firstName: 'Alice', email: 'alice@doe.com' },
    ];
  }
}
