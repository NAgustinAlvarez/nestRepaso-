/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from 'src/users/dtos/get-user.dto';
import { UserService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
    private readonly signInProvider: SignInProvider,
  ) {}

  async signIn(signInDto: SignInDto): Promise<boolean> {
    return await this.signInProvider.signIn(signInDto);
  }

  isAuth() {
    return true;
  }
}
