import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UserService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { ActiveUserData } from '../interfaces/active-user.interface';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    /**
     *Inject jwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
     * Inject generateTokenProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    //verify the refresh token

    //***** verify Async toma dos argumentos, el refreshtoken para verificar y el segundo es un objeto que encontrará el secret, audience y issuer, luego devuelve el payload */
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      //fetch user from the database

      const user: User = await this.userService.findOneById(sub);
      //generate the token
      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
