/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from 'src/users/dtos/get-user.dto';
import { UserService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  login(id: number, email: string, password: string) {
    const user = this.userService.findOneById(id);
    return 'SAMPLE_TOKEN';
  }

  isAuth() {
    return true;
  }
}
