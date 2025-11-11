import { Injectable } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';

@Injectable()
export class RefreshTokensProvider {
  async refreshTokens(refreshToken: RefreshTokenDto) {
    //verify the refresh token
    //
  }
}
