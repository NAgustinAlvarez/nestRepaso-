Repaso de Nest.
1-Nest new --nombre-del-proyecto.

2-npm run o npm run start:dev.

3- Modulos:

El .module.ts es una clase decorada con @Module() que agrupa logica relacionada. Cada modulo estará declarado en app.module.ts.

-Controllers (manejan rutas y request HTTP) Ej: users.controller.ts
Un Controller no debe tener lógica de BD → solo recibe la request, la pasa al service y devuelve la respuesta.

-Providers/Services (contienen la lógica de negocio) Ej: users.services.ts
Normalmente, ahí va el código para crear, leer, actualizar o eliminar datos (CRUD).

-Imports (otros modulos que necesita)

-Exports (qué cosas comparte con otros módulos)

-Entidades usadas con ORMS para manejar las entidades en base de datos. Ej: user.entity.ts

-Spec para testear. Ej: users.controller.spec.ts

4- Nest Cli:
\*nest --help .Contiene todos los comandos del cli de nest para generar recursos.

\*nest generate --help. Contiene opciones y especificaciones para la creación de recursos; como -no--spec y otros.

    Entre los más usados:
    - nest generarte module <nombre> (crea solo modulo)
    - nest g resource nombre --no-spec (crea modulo con controller y service sin spec)
    --dry-run(para simulaciones) por ejemplo  nest generarte module <nombre> --dry-run

5- Http yak:
Funciona como postman u insomnia, solo que en nuestro proyecto.
Ej: app.endpoints.http.

6- Controllers:
Se encargará del enrutado y consultará a los servicios para la comunicación con la bd.

usa el decorador @Controller("<--ruta-->") y decoradores @Get @Put y etc. con metodos de la clase. Tipo getUsers(){}

7- Params, query, Body:

@Param, dentro del decorador, por ejemplo Get() ponemos dentro el que será el para luego de /: lo que le indica a nest que ese será el param. Ej: Get(/:id).
@Get('/:id/:optional') creara un objeto con esos dos parametros.
GET http://localhost:3000/users/1234

@Query se agregan con ? en la url luego de una clave y valor. Para utilizarlo se agrega el decorador en el metodo. Ej: getUsers(@Param("id") id: any, @Query("limit(se extrae la propiedad)) limit: number, @Query("offset") offset: number)
GET http://localhost:3000/users/1234
?limit=10
&offset=20

@Body se utiliza en el metodo tambien Ej: createUsers(@Body() request: any)
toma el json que se uso.
POST http://localhost:3000/users
Content-Type: application/json
{"firstName": "Nicolas",
"lastName": "Alvarez",
"email": "nicolas@alvarez.com",
"password": "123456"}

podemos extraer por ejemplo la propiedad seleccionada al igual que con params y query Ej:
createUser(@Body("email) email:string){console.log(email)}

8- Existen los decoradores @Header y @Ip para extraer datos de quién envia una solicitus en las post request.

9- Pipes:

    🔄 Ciclo de vida de un Request en NestJS

    a. Envío de la Request (Client → Server)

    El cliente (Postman, navegador, app, etc.) hace una petición HTTP (GET, POST, etc.) al servidor NestJS.

    b.Middleware
    Es lo primero que intercepta el request, antes de que llegue al contexto de NestJS.
    Se parece al middleware de Express (porque internamente Nest usa Express/Fastify).
    Usos típicos: logging, validación de tokens crudos, modificar el request antes de que siga.

    c.Guards (Autorización/Autenticación)
    Los Guards determinan si el request puede continuar o debe ser bloqueado.
    Ejemplo: AuthGuard que revisa si el usuario tiene un JWT válido.
    Se ejecutan antes de entrar al controlador.

    d.Interceptors (pre-controller)
    Los interceptores pueden ejecutar lógica antes de que entre al controlador.
    Ejemplo: transformar datos de entrada, logging del tiempo de ejecución.

    e.Pipes (Validación y Transformación)
    Se aplican justo cuando los parámetros ya están mapeados (@Body, @Param, @Query).
    Ejemplo: ParseIntPipe convierte "10" en 10.
    Ejemplo con class-validator: validar que un DTO tenga email válido.

    d.Controller
    Ahora sí, entra al método de tu @Controller.
    Ejemplo: getUsers(@Param('id') id: number, @Query() query: QueryDto).
    Acá llamás a los Services, que interactúan con la lógica de negocio y la base de datos.

    e.Interceptors (post-controller)
    Después de que el controlador devuelve algo, los interceptores pueden modificar la respuesta.
    Ejemplo: formatear la respuesta en un ResponseDto, cachear resultados, logging.

    f.Exception Filters
    Si durante el proceso hubo un error o se lanzó una excepción (throw new HttpException(...)), los filtros deciden cómo formatear y devolver la respuesta de error.
    Ejemplo: HttpExceptionFilter → devuelve un JSON con { statusCode, message, timestamp }.

    g.Respuesta final (Server → Client)
    El resultado (o el error procesado) viaja de vuelta al cliente.

Las dos principales funciones de los pipes son:

- evaluar los inputs y si no se cumplen lanzar una excepcion.
- transformar el input a la forma deseada.

Algunos de estos son:
ValidationPipe
ParseIntPipe
ParseFloatPipe
ParseBoolPipe
ParseArrayPipe
ParseUUIDPipe
ParseEnumPipe
DefaultValuePipe
ParseFilePipe
ParseDatePipe

se usan dentro de los decoradores de @Param(), @Query() y @Body(). Ej: @Param("id", ParseIntPipe). Ahora el param que por defecto es string va a pasar a tipo number; todo esto si es un número. Si no lo es lanza una excepcion.

-new DefaultValuePipe(<-valor->) da un valor default. Ej: @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number

10- DTO
Usado generalmente para validar datos que serían muy complicados de validar con los pipes que vienen por default. Son clases decoradas con implementaciones de class-validator. (instalar)
npm i class-validator.
Los decoradores son sumamente descriptivos. @Matches se usa junto con expresiones regulares. Ej:

@IsEmail()
@IsNotEmpty()
email: string;

@IsString()
@IsNotEmpty()
@MinLength(6)
@Matches(/^(?=._[a-z])(?=._[A-Z])(?=._\d)(?=._[\W_]).+$/, {
message:
'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
})
password: string;

-11: Class transformer
Funciona a la par con class-validator para transformar tipos de datos provenientes en los inputs.
npm i class transformer.

-12: Uso de dto en controlador.
dentro del metodo y del decorador se agrega el new ValidationPipe y se pone el tipo de dato (DTO) para el dato que viene.
Ej: createUsers(@Body('email', new ValidationPipe()) email: CreateUserDto)
Aunque el new ValidationPipe() suele ponerse de forma global en main.ts
Ej: async function bootstrap() {
const app = await NestFactory.create(AppModule);
app.useGlobalPipes(
new ValidationPipe({
whitelist: true, //elimina cualquier propiedad que no esté en el dto
forbidNonWhitelisted: true, //lanza error si hay alguna propiedad que no esté en el dto
transform: true, //transforma a los tipos de datos definidos en el dto si es posible, además transforma el objeto que viene a un tipo de objeto igual al DTO. Es importante por seguridad.
}),
);
await app.listen(process.env.PORT ?? 3000);
}
13: Transform.
Para transformar directamente en el dto se usa el decorador @Type().
Ej: export class GetUsersParamDto {
@IsOptional()
@Type(() => Number)
@IsInt()
id?: number;
}

14: Map Types.

npm i @nestjs/mapped-types

El paquete @nestjs/mapped-types sirve para generar clases DTO nuevas a partir de otras DTO ya existentes, sin tener que reescribir todos los decoradores de class-validator. Ya que esto es ineficiente.

Cuando querés un UpdateUserDto, normalmente es igual a CreateUserDto, pero con todos los campos opcionales.
En vez de copiar/pegar, usás PartialType:

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
export class UpdateUserDto extends PartialType(CreateUserDto) {}

otros: OmitType para excluir ciertos campos como password, PickType para crear un DTO con algunos campos seleccionados de otro DTO.

15: Dependency injection.

Sirve para optimizar la inicialización de clases; una vez creadas solo se pasarán donde sean necesarias. Y no se creará otra instancia cada vez.

Decisiones en el .module.ts en el module aparte de los controllers, e imports tenemos los: 1. Provide. Que son los servicios que va a utilizar nuestro modulo. 2. Export. Que son las partes de nuestro modulo que queremos compartir con otros módulos.

Hay tres etapas para la inyeccion.

1. Declarar el @injectable

   @Injectable()
   export class AppService {
   getHello(): string {
   return 'Hello World!';
   }  
   }

2. Conectarlo al módulo. En providers.
   @Module({
   imports: [UsersModule],
   controllers: [AppController],
   providers: [AppService],
   })
   export class AppModule {}

3. Injectarlo en el controlador como servicio.
   @Controller()
   export class AppController {
   constructor(private readonly appService: AppService) {}

@Get()
getHello(): string {
return this.appService.getHello();
}
}
