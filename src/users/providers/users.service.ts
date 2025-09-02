/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authservice: AuthService,
  ) {}
  getUsers(): string {
    return 'this is a users service';
  }

  findAll(limit: number, page: number) {
    const isAuth = this.authservice.isAuth();
    console.log(isAuth);
    return [
      { firstName: 'John', email: 'john@doe.com' },
      { firstName: 'Alice', email: 'alice@doe.com' },
    ];
  }

  findOneById(id: GetUsersParamDto) {
    return { id: 1, firstName: 'Alice', email: 'alice@doe.com' };
  }
}
