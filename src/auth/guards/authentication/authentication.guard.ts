/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-labels */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccesTokenGuard } from '../acces-token/acces-token.guard';
import { AuthType } from 'src/auth/constants/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<AuthType, CanActivate[]>;
  //Record es un tipo genérico para objetos clave - valor.
  constructor(
    private readonly reflector: Reflector,
    private readonly accesTokenGuard: AccesTokenGuard,
  ) {
    // Aquí sí se puede usar this.accesTokenGuard
    this.authTypeGuardMap = {
      [AuthType.Bearer]: [this.accesTokenGuard],
      [AuthType.None]: [{ canActivate: () => true }], // objeto con interfaz canActivate
    }; // Luego se ve [1,0] porque Authtype es un enum, y nest imprime valores numéricos para enums
  }

  async canActivate(context: ExecutionContext) {
    //authTypes from reflector
    const authTypes = this.reflector.getAllAndMerge(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // FIX: Usa length > 0 para detectar array vacío
    const finalAuthTypes =
      authTypes?.length > 0 ? authTypes : [AuthenticationGuard.defaultAuthType];

    // console.log('PRIMER CONSOLE', finalAuthTypes); // ← AHORA [1]

    //Explicación.
    //Reflector analiza los metadatos con la clave y getAllAndMerge crea como una especie de objeto del método y la clase. Se evalúa por orden: si se encuentra la clave, se toma la del método; si no, la de la clase.
    // ej:
    //       @Auth(AuthType.Bearer)
    // @Controller('users')
    // export class UserController {
    //   @Get()
    //   getUsers() {} // Usa AuthType.Bearer (heredado de la clase)

    //   @Auth(AuthType.None)
    //   @Post()
    //   createUser() {} // Usa AuthType.None (definido en el método)
    //devolvería por ejemplo authTypes = [AuthType.Bearer, AuthType.None]
    // }
    //Show authTypes

    const guards = finalAuthTypes
      .map((type) => this.authTypeGuardMap[type])
      .flat(); //El método .flat() aplana (flatten) un array anidado, es decir, toma arrays dentro de arrays y los convierte en un solo nivel.

    //print all the guards
    // console.log('SEGUNDO CONSOLE', guards);

    //default error
    const error = new UnauthorizedException();

    //Loop guards canActivate
    for (const instance of guards) {
      // console.log('TERCER CONSOLE', instance);
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        err: error;
      });
      // console.log('CUARTO CONSOLE', canActivate);
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
