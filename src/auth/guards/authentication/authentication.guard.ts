/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccesTokenGuard } from '../acces-token/acces-token.guard';
import { AuthType } from 'src/auth/constants/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly accesTokenGuard: AccesTokenGuard,
  ) {
    // Aquí SÍ puedes usar this.accesTokenGuard
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accesTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  canActivate(context: ExecutionContext) {
    //authTypes from reflector
    const authTypes = this.reflector.getAllAndMerge(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(), //"Reflector analiza los metadatos con la clave y getAllAndMerge crea como una especie de objeto del método y la clase, y se evalúa por orden: si se encuentra la clave, se toma la del método; si no, la de la clase."
    ]) ?? [AuthenticationGuard.defaultAuthType];

    console.log(authTypes);
    //arrays of guards
    //Loop guards canActivate
    return true;
  }
}
