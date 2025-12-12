/* eslint-disable @typescript-eslint/no-unused-vars */
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UserService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { last, retry } from 'rxjs';
@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;
  constructor(
    /**
     * Inject jwtCOnfinguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
     * Inject usersService
     */
    @Inject(forwardRef(() => UserService))
    private readonly usersService: UserService,
    /**
     * Inject generateTokenProvider
     */
    private readonly generateTokenProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authentication(googleTokenDto: GoogleTokenDto) {
    //verify the google token sent by User

    const loginTicket = await this.oauthClient.verifyIdToken({
      idToken: googleTokenDto.token,
    });
    console.log(loginTicket);
    //Extract the payload from google jwt
    const payload = loginTicket.getPayload();

    if (!payload) {
      throw new Error('Invalid Google token payload');
    }

    const {
      email,
      sub: googleId,
      given_name: firstName, // destructuring with renaming
      family_name: lastName,
    } = payload;

    if (!email || !googleId || !firstName || !lastName) {
      throw new Error('Invalid Google token payload: missing fields');
    }

    //Find the user in the database using the GoogleId
    const user = await this.usersService.findOneByGoogleId(googleId);
    //If googleId exists generate token
    if (user) {
      console.log(email);
      return this.generateTokenProvider.generateTokens(user);
    }
    //If nor create a new user and then generate tokens
    const newUser = await this.usersService.createGoogleUser({
      email: email,
      firstName: firstName,
      lastName: lastName,
      googleId: googleId,
    });
    return this.generateTokenProvider.generateTokens(newUser);
    //Throw Unauthorised exception
  }
}
