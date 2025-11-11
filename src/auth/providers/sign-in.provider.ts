/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UserService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { NotFoundError, retry } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    /**
     * Inject Hashing provider
     */
    private readonly hashingProvider: HashingProvider,
    /**
     * Inject JWT service
     */
    private readonly jwtService: JwtService, //parte de JWTMODULE
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
     * Inject generateTokenProvider
     */
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}
  async signIn(signInDto: SignInDto) {
    //find the user using email id
    //throw an exception user not found
    const user = await this.userService.findOneUserByEmail(signInDto.email);

    //compare password to the hash
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user?.password,
      );
      if (!isEqual) {
        throw new UnauthorizedException('Incorrect password');
      }
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }
    return this.generateTokenProvider.generateTokens(user);
  }
}
