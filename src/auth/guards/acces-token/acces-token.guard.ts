/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import jwtConfig from 'src/auth/config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
@Injectable()
export class AccesTokenGuard implements CanActivate {
  constructor(
    /**
     * Inject JWTService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * Extract the request from  the execution context
     */
    const request = context.switchToHttp().getRequest();
    /**
     * Extract the token from header
     */
    const token = this.extractRequestFromHeader(request); //Del metodo de debajo
    /**
     * Validate the token
     */
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      //ej:
      // {
      //   sub: 42,
      //   email: 'nico@example.com',
      //   role: 'admin',
      //   iat: 1730650247,
      //   exp: 1730653847
      // }
      request[REQUEST_USER_KEY] = payload; //GUARDO EL PAYLOAD EN LA REQUEST PARA QUE SIGA EN EL CICLO
      console.log(payload);
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
