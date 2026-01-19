//para cambiar los archivos a LF npx prettier --write .

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

3.a\*- Diferenciación módulos, Helpers estáticos.
(ej pagination tiene un modulo por utilizar repositorios en el servicio)
Modulos características:

✅ NestJS instancia automáticamente los servicios (@Injectable).
✅ Permite inyección de dependencias (DI).
✅ Organiza y comparte lógica entre módulos.
❌ Más formal, se usa cuando hay dependencias o lógica reutilizable.
Si tu servicio usa repositorios u otros providers, siempre conviene @Injectable() + módulo para aprovechar DI.

HELPERS ESTÁTICOS (por ejemplo: error.service.ts)
Qué son
Son clases o funciones comunes que no dependen del contenedor de NestJS.
No necesitan inyección ni módulo: las llamás directamente.

export class DatabaseErrorService {
static throwError(action: string): never {
throw new Error(`Error while ${action}`);
}
}
O incluso una función común:
export function formatDate(date: Date) {
return date.toISOString();
}

Características:

✅ Se usan directamente, sin @Injectable() ni módulo.
✅ Simples, rápidas, sin dependencias.
❌ No se pueden inyectar (sin DI).
❌ No podés usar servicios de NestJS adentro.

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
transform: true, //transforma a los tipos de datos definidos al dto definidi si es posible. Es importante por seguridad.
transformOptions: { enableImplicitConversion: true }, // es un opción de class-transformer que se pasa cuando transform: true.
Permite la conversión automática de tipos primitivos aunque no uses decoradores explícitos como @Type().
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

Otro util es IntersectionType para combinar dos types. por ejemplo en este, PaginationQueryDto y GetPostBaseDto:

import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
@IsOptional()
@IsPositive()
@Type(() => Number)
limit?: number;

@IsOptional()
@IsPositive()
@Type(() => Number)
page?: number;
}

import { IsDate, IsOptional } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
class GetPostBaseDto {
@IsDate()
@IsOptional()
startDate?: Date;

@IsDate()
@IsOptional()
endDate?: Date;
}

export class GetPostDto extends IntersectionType(
GetPostBaseDto,
PaginationQueryDto,
) {}

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

16: Intermodular dependency.

En imports irá la interdependencia de modulos. En providers irán solo los servicios quizás de otros modulos.
@Module({
controllers: [UsersController],
providers: [UsersService], // ✅ se declara acá
exports: [UsersService], // ✅ solo si lo necesitan otros módulos
})
export class UsersModule {}
ts
Copiar
Editar
// posts.module.ts
@Module({
controllers: [PostsController],
providers: [PostsService],
imports: [UsersModule], // ✅ trae consigo UsersService exportado
})
export class PostsModule {}

17: Circular dependency.
Son dependencias que se necesitan mutuamente. Por ejemplo un modulo usuario, con un modulo auth. Al hacer login desde el servicio de auth se solicitará un usuario del modulo users. Y para traer por ejemplo algún dato de un usuario desde el modulo de users se solicitará a auth.
Las dependencias circulares se manejan distinto porque sino se generá un bucle infinito.
Para eso primeramente se exportan los servicio de cada modulo. Luego se utiliza forwardRef(()=>Modulo que se trae) en el import. Y en el servicio se usa @Inject dentro del constructor con forwardRef(()=>Servicio circular), además de declararse normalmente. Ej:
@Module({
controllers: [AuthController],
providers: [AuthService],
exports: [AuthService],
imports: [forwardRef(() => UsersModule)],
})
export class AuthModule {}
export class AuthService {
constructor(
@Inject(forwardRef(() => UserService))
private readonly userService: UserService,
) {}}

18: Swagger.
npm i @nestjs/swagger

a. Primero se genera el config donde se define la versión, el titulo, la descripción, etc. const config = new DocumentBuilder()
.setTitle('Nestjs Repaso')
.setDescription('Use the base API url as http://localhost:300')
.setVersion('1.0')
.build();
b. Se crea el documento con la app y el config. Ej: const document = SwaggerModule.createDocument(app, config);
c. Se completa el setup con el path de la documentación, la app en sí y luego el documento. Ej: SwaggerModule.setup('api', app, document);

ahora en la ruta /api estará la documentación.

\*Diferenciación de endpoints en documentación.
Se hace en el controlador con el decorador @ApiTags("nombre")

\*Declaración de valores para path, a veces swagger no infiere directamente entonces es necesario declararlas en el controlador. Asi en el endpoint los parametros estarán mejor detallados. Ej:

@Get('/:id')
@ApiParam({
name: 'id',
type: Number,
required: true,
description: 'ID único del usuario que se desea obtener',
example: 1,
})
@ApiQuery({
name: 'limit',
type: Number,
required: false,
description: 'Cantidad máxima de resultados a devolver (paginación)',
example: 10,
})

\*Declaración de operación. Descripción de cada endpoint
@Get('/:id')
@ApiOperation({
description: 'Fetches a list of registered users on the application',
})

\*Declaración de respuestas.
@ApiResponse({ status: 200, description: 'Users fetched succesfully' })

19: Sql - TypeOrm
\*primeramente instalamos pgadmin, luego agregamos el path a windows.

\*luego en consola: npm i typeorm @nestjs/typeorm pg

20: conexión a typeorm. La mayoría de info esta en : https://typeorm.io/docs/data-source/data-source-options
En nest el dataSource puede agregarse directamente a el modulo de app. de está forma: export const AppDataSource = new DataSource({
type: "postgres",
host: "localhost",
port: 5432,
username: "test",
password: "test",
database: "test",
synchronize: true,
logging: true,
entities: [Post, Category],
subscribers: [],
migrations: [],
})

21: env. files (más adelante en curso)
Para que el modulo del dataSource sea dinámico debemos usar forRootAsync. Para que lea archivos .env. Que cambiaran el comportamiento o serviran para la seguridad de la bd.
TypeOrmModule.forRootAsync({
imports: [],
inject: [],
useFactory: () => ({
type: 'postgres',
entities: [],
synchronize: true,
port: 5432,
username: 'postgres',
password: 'nico5329',
host: 'localhost',
database: 'postgres',
}),
}),

22. Entendimiento de estructura.
    Primeramente es necesario generar archivos de entidades. Son clases con decoradores que generan las entidades con cuántas columnas y clases tendrá la entidad.Agregamos esta entidad a la declaración de entidades en la configuracion de typeOrm. Luego typeOrm cuando sea necesario; inyecta el repositorio de la entidad a el servicio del modulo que se requiera. Y así se podrá comunicarse con la bd.

23: Entidad.
Se crea igual que una clase y luego tendrá que agregarse a la configuración de typeOrm terminan en entity.ts. Se definen columnas de la tabla. Ej:
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
@PrimaryGeneratedColumn()
id: number;
@Column()
firstName: string;
@Column()
lastName: string;
@Column()
email: string;
@Column()
password: string;
}

24: Tipo y configuración en la entidad.

Tipos de columnas de entidades https://typeorm.io/docs/entity/entities#column-types en la "parte" column types.
Para id, enum, json.

Tipo de configuracion de la columna: https://typeorm.io/docs/entity/entities/#column-options
Para nombre especifico, tipo, longitud, unicidad, valor default, nullable(valor nulo o vacio).
Ej : @Column({
name: 'full_name', // 👈 así se llamará en la DB
type: 'varchar',
length: 150,
unique: true,
})
name: string;

24a: @DeleteDateColumn(), @UpdateDateColumn(), @CreateDateColumn()

En la columna sirve para el soft delete y actualizaciones del usuario, registran fechas por si solas al hacer save o softDelete.

Cuando usás soft delete en TypeORM:
await userRepository.softDelete(1);
Lo que ocurre es:
NO se borra el registro de la base de datos.
Se actualiza la columna deletedAt con la fecha/hora actual (NOW() del servidor).

Luego al buscar con los metodos normales no esta columna aparece oculta a menos que uses. await userRepository.find({
withDeleted: true, // incluye los "soft deleted"
});

Más decoradores de diferentes tipos: https://typeorm.io/docs/help/decorator-reference/#column-decorators
25: Creación de repositorio.
Por ejemplo en mi caso en database/postgres/schemas/public/tables se encuentran las tablas creadas para cada entidad.

a- Vamos al service del modulo. y lo inyectamos con el decorador @InjectRepository(<entidad>) ej:

constructor(
@InjectRepository(User)
private readonly usersRepository: Repository<User>)

b- Vamos al modulo y donde va a crearse el repositorio y en imports declaramos la entidad con el modulo de typeOrm. EJ:
@Module({
controllers: [UsersController],
providers: [UserService],
imports: [ TypeOrmModule.forFeature([User])],
exports: [UserService],
})
c- uso en servicio ejemplo.

async createUser(createUserDto: CreateUserDto) {
//Check if the user exist with same mail
const existingUser = await this.usersRepository.findOne({
where: { email: createUserDto.email },
});
//Handle exception}

    //Create new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

}

26- Autoload entities:
Type Orm puede cargar las entidades por si sola si dentro de la configuración detallamos autoloadEntities: true.
Pero tenemos que declarar a cada entidad en el modulo necesario con TypeOrmModule.forFeture([<nombreDeEntidad>])
Definís una entidad con @Entity().

a-Usás TypeOrmModule.forFeature([User]).

b-Nest registra un provider para el repositorio de User.

c-Si tenés autoLoadEntities: true, además esa entidad se suma automáticamente al entities[] global de TypeORM.

d-Ahora podés inyectar el repositorio en tu servicio y trabajar con la tabla correspondiente.

ej: @Module({
controllers: [PostsController],
providers: [PostsService],
imports: [UsersModule, TypeOrmModule.forFeature([Post])],
})
export class PostsModule {}

27- Relación One to One.
En una tabla una fila está relacionada solo a una fila de otra tabla

@OneToOne se pone en ambas entidades

@JoinColumn Marca cuál de las tablas es la dueña de la relación (la que tendrá la foreign key). Sin esto, TypeORM no sabe dónde guardar la FK.

28- Creación de la relacion sin cascada.
a. Asociamos el repositorio al modulo con typeOrmModule.forFeature por ejemplo en esta caso metaOptions.
@Module({
controllers: [PostsController],
providers: [PostsService],
imports: [UsersModule, TypeOrmModule.forFeature([Post, MetaOptions])],
})
export class PostsModule {}

el servicio comprueba al existencia de la propiedad en el json y crea una instancia para luego guardarla. Y asignarsela a la tabla de post. async create(createPostDto: CreatePostDto) {
//create metaOptions before post
let metaOptions = createPostDto.metaOptions
? this.metaOptionRepository.create(createPostDto.metaOptions)
: null;
if (metaOptions) {
await this.metaOptionRepository.save(metaOptions);
}
//create post
let post = this.postRepository.create(createPostDto);
//add metaOptions to the post
if (metaOptions) {
post.metaOptions = metaOptions;
}
//return the post
return await this.postRepository.save(post);
}

29. Creación de relacion con cascada.
    Es la mejor forma. Ya que lo otro genera codigo innecesario.
    Por ejemplo en la entidad post del ejemplo anterior agregamos la propiedad cascade. @OneToOne(() => MetaOptions, {
    cascade: ['remove', 'insert'],
    nullable: true,
    })
    @JoinColumn()
    metaOptions: MetaOptions | null;
    }

Que lo que hace es actuar segun lo que le asignemos, en este caso al momento de crear el post se va a crear la tabla para metaOptions y se va a insertar en post.

Ahora el create quedaría así:

async create(createPostDto: CreatePostDto) {
let post = this.postRepository.create(createPostDto);
return await this.postRepository.save(post);
}

Esto es asignable para cuando tenés una relación como @OneToOne o @OneToMany.
¿Para que sirven las especificaciones? Sirve para que ciertas operaciones (insert, update, remove, etc.) que hagas en la entidad principal se propaguen automáticamente a la entidad relacionada.

Opciones posibles en cascade: [""]
Podés poner un array con las operaciones que querés habilitar. Estas son las válidas:
"insert" → inserta automáticamente la entidad relacionada.
"update" → actualiza automáticamente la entidad relacionada.
"remove" → elimina automáticamente la entidad relacionada.
"soft-remove" → aplica soft delete en la entidad relacionada.
"recover" → restaura una entidad que fue soft-deleted.

30. Eager Loader (carga embebida), query related entities.
    La carga de tablas con relaciones no se hace por defecto, es decir al momento de hacer fetch los datos que no sean propios de la tabla no serán traidos, (claves, ids de otras tablas). Dos formas de traer estos datos al hacer fetch.

a. Declarar la relacion en el servicio:
async findAll(userId: GetUsersParamDto) {
const user = this.userService.findOneById(userId);
let posts = await this.postRepository.find({
relations: { metaOptions: true },
});
return posts;
}

b. En la entidad declarar la propiedad eager en la columna de la ralacion:
Por ejemplo esta entidad siempre va a traer los autores
@ManyToOne(() => User, (user) => user.post, { eager: true })
author: User;
Por eager:true.

31. Deleting related entities. Borrar entidades relacionadas.
    Cascade de TypeORM
    Funciona solo cuando usás métodos de TypeORM (remove, save, softRemove).

Se propaga desde el propietario hacia la entidad relacionada.
Si ya tenés cascade: ['remove'] en la relación, podés dejar tu método así:

async delete(id: number) {
const post = await this.postRepository.findOneBy({ id });
if (!post) return null;

await this.postRepository.remove(post); // borra post y metaOptions
return post;
}

A su vez también se puede eliminar con el metodo .delete en el repositorio. A la entidad asociada se le agrega como propiedad onDelete.
🔹 1. onDelete en la base de datos
Funciona a nivel de la columna FK.
La FK apunta al padre, así que la DB sabe que cuando borrás el registro padre, debe borrar el hijo.
No importa quién es el propietario en TypeORM: lo importante es dónde está la FK en la tabla.

@OneToOne(() => Post, (post) => post.metaOptions, { onDelete: 'CASCADE' })
@JoinColumn()
post: Post;

32. Bidireccionalidad.
    se agrega el one to one a la entidad hija (metaOptions), con la entidad a la que se relaciona (post) y una funcion que devuelve la relacion inversa.
    @Entity()
    export class MetaOptions {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'json', nullable: false })
    metaValue: string;

            @CreateDateColumn()
            createdDate: Date;

            @UpdateDateColumn()
            updateDate: Date;

            @OneToOne(() => Post, (post) => post.metaOptions)
            post: Post;
            }

A su vez a la entidad padre (post) tambien se le agrega al arrow function con la relacion inversa.
@OneToOne(() => MetaOptions, (metaOptions) => metaOptions.post, {
cascade: ['remove', 'insert'],
eager: true,
nullable: true,
})
@JoinColumn()
metaOptions: MetaOptions | null;

33.One to many.
se usan los decoradores con dos arrow function, la primera apuntando a la entidad y la segunda con el aspecto de la entidad.
Ej:
@OneToMany(() => Post, (post) => post.author)
post: Post[];
@ManyToOne(() => User, (user) => user.post)
author: User;

34.Many to many relationship.
Usan una tabla intermedia para el relacionamiento.
Una tabla será la que sea propietaria de la relacion. Con el join column.
@ManyToMany(() => Tag)
@JoinTable()
tags?: Tag[];
Si eliminamos este campo, por ejemplo en este caso eliminamos el post, el campo en la tabla intermedia que contenía la relación se borrará tambien. Efecto en cascada.
No se debe aclarar como en otros casos el cascade.

35. Many to many bidireccional.
    Al igual que las otras relaciones se pone en cada entidad y se hace un call al inverso.
    @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
    @JoinTable()
    tags?: Tag[];

36. Cascade delete with many to many.
    Por ejemplo en la relacion muchos a muchos post-tags. Donde muchos post pueden tener un mismo tag y un tag puede tener muchos post. Si eliminamos un post se va a generar una eliminación por cascada del campo en la tabla intermedia, ya que tiene el joinColum que provoca esto.
    Pero si queremos eliminar un tag de la base de datos; tag no tiene joinColumn.Y se producirá un error.

    Aparecerá algo así: QueryFailedError: update o delete en «tag» viola la llave foránea «FK_41e7626b9cc03c5c65812ae55e8» en la tabla «post_tags_tag» QueryFailedError: update o delete en «tag» viola la llave foránea «FK_41e7626b9cc03c5c65812ae55e8» en la tabla «post_tags_tag»

    Para generar la eliminación correcta vamos a la entidad y en la relacion many to many tenemos que aclarar que en la elimnación se genere la eliminación de la tabla intermedia directamente generado por la base de datos. No por typeOrm.

    @ManyToMany(() => Post, (post) => post.tags, { onDelete: 'CASCADE' })
    posts: Post;
    @CreateDateColumn()
    createDate: Date;

37. Soft delete configuration.
    No se eliminan ni la columna intermedia, ni el campo de la tabla.
    Solo se genera el timeStamp de delete cuando se invoca el metodo de softDelete. Este campo de la entidad se declara en la entidad.

    \*en entidad
    @DeleteDateColumn()
    deleteDate: Date;

    \*servicio

    async softDelete(id: number) {
    await this.tagsRepository.softDelete(id);
    return { softDelete: true, id };
    }

    \*Luego surgen varias variantes para utilizar estos campos.
    async findAll() {
    // solo devuelve los que no están "borrados"
    return await this.tagsRepository.find();
    }

    async findAllWithDeleted() {
    // incluye los que tienen deleteDate
    return await this.tagsRepository.find({ withDeleted: true });
    }

    async restore(id: number) {
    // restaura un registro "soft deleted"
    await this.tagsRepository.restore(id);
    return { restored: true, id };

38. Enviroments.
    Es usual que contemos con datos que cambien según las necesidades. Por ejemplo en el desarrollo de una aplicación podemos no trabajar en la misma base de datos que en la producción, o en el testing. Para eso existen los enviroments en node y nestJs.
    En una aplicación casi siempre tenés diferentes entornos de ejecución:

    Development → donde probás y debuggeás.
    Testing → usado para correr pruebas automatizadas.
    Production → el entorno real que usan los usuarios.
    Cada entorno necesita configuraciones distintas:
    Base de datos diferente.
    Tokens o keys distintas (por ejemplo, Mercado Pago sandbox vs. producción).
    URL de APIs externas.
    Parámetros de logs, seguridad, etc.
    👉 Para manejar eso se usan los environment variables, normalmente en archivos .env.

39. ConfigModule.
    npm i @nestjs/config

    Para acceder a las variables se utiliza un modulo especial entregado por nestjs llamado configModule.
    Para que las varibles sean accesibles en todos los modulos vamos a nuestro app.module y declaramos el config con los demás módulos, con una propiedad global.

    ConfigModule.forRoot({ isGlobal: true })

    Luego para usarlo por ejemplo en un servicio (en user.service.ts).

    private readonly configService: ConfigService, en el constructor, importamos el service del config y por ejemplo para obtener las variables almacenadas se pone la clave y un metodo.

    findAll(limit: number, page: number) {
    const enviroment = this.configService.get('S3_BUCKET');
    console.log(enviroment);
    }

    por ejemplo accede a la clave en S3_BUCKET.

40. NODE_ENV y test

🔹 ¿Qué es NODE_ENV?

NODE_ENV es una variable de entorno estándar en Node.js.

Se usa para indicar en qué modo está corriendo tu app:

"development" → cuando estás desarrollando.

"production" → cuando la app está en un servidor real.

"test" → cuando ejecutás tests (Jest, e2e, unit tests).

NestJS y muchas librerías (TypeORM, dotenv, etc.) leen NODE_ENV para cargar configuraciones diferentes (por ejemplo, distinta DB para testing, logging deshabilitado en prod, etc.).

En los test e2e se analiza todo el recorrido de esa función o módulo, por eso en nuestro test e2e creado por default por nest es necesario mostrarle todo nuestro proyecto. Los test e2e a diferencia de los unitarios usan la configuración en su propio json. En cambio los unitarios usan el package.json. Cambiamos (en e2e.json) el rootDir a ../ y el modulePath para que pueda resolver importaciones.
{
"moduleFileExtensions": ["js", "json", "ts"],
"rootDir": "../",
"modulePaths": ["<rootDir>"],
"moduleNameMapper": {
"^src/(.\*)$": "<rootDir>/src/$1"
  },
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
"transform": {
"^.+\\.(t|j)s$": "ts-jest"
}
}

moduleFileExtensions

Extensiones que Jest considera al resolver imports (.ts, .js, .json).

rootDir: "../"

Arranca desde la raíz del proyecto (sube un nivel desde /test).

Así Jest puede acceder a src/, package.json, etc.

modulePaths: ["<rootDir>"]

Le decís a Jest: “cuando busques módulos, arrancá desde el root del proyecto”.

Eso permite que puedas hacer imports como:

import { AppModule } from 'src/app.module';

en lugar de:

import { AppModule } from '../src/app.module';

testEnvironment: "node"

Los tests corren en un entorno de Node (no en JSDOM como en tests de frontend).

testRegex: ".e2e-spec.ts$"

Solo ejecuta archivos que terminen en .e2e-spec.ts.

transform: { "^.+\\.(t|j)s$": "ts-jest" }

Usa ts-jest para compilar .ts y .js antes de correrlos.

Para cambiar la fuente de los test unitario vamos a package.json en la sección jest. y buscamos y cambiamos por esto:
"jest": {
"moduleFileExtensions": [
"js",
"json",
"ts"
],
"rootDir": "./",
"modulePaths": [
"<rootDir>",
],
"testRegex": "._\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
},
"collectCoverageFrom": [
"\*\*/_.(t|j)s"
],
"coverageDirectory": "../coverage",
"testEnvironment": "node"
}

\*Parte final.
Al hacer npm run test:e2e deberíamos obtener el consologeo de test, ya que es la variable utilizada en test.

|funcion en el e2e|
it('/ (GET)', () => {
console.log(process.env.NODE_ENV);
return request(app.getHttpServer()).get('/').expect(404);
});

41. Conditionally loading enviroment.
    Los entornos condicionales son usados para distintos propositos, una forma de generalos podría ser así. Donde en el aspecto. envFilePath se pone la ruta condicional del env que queremos leer.

const ENV = process.env.NODE_ENV;
ConfigModule.forRoot({
isGlobal: true,
envFilePath: !ENV ? '.env' : `.env.${ENV}`,
}),

Por otro lado en el package.json podemos definir el valor de NODE_ENV.

"start:dev": "cross-env NODE_ENV=develop
ment nest start --watch",

42. Config service y process. (Inject DB details)
    En NestJS podés cargar variables de entorno de dos formas, pero hay una diferencia importante:

process.env directamente → accedés a la variable de entorno de forma “plana”, como lo harías en cualquier proyecto de Node.js.

username: process.env.DB_USER,
password: process.env.DB_PASS,

Esto funciona, pero no pasa por la configuración centralizada de Nest.

ConfigService (usando @nestjs/config) → es la forma recomendada en NestJS porque:

Te permite centralizar todas las variables.

Podés validar las variables con schemas (por ejemplo con Joi).

Es más fácil testear porque podés mockear el ConfigService.

Ejemplo con ConfigService (recomendado):

TypeOrmModule.forRootAsync({
imports: [ConfigModule],
inject: [ConfigService],
useFactory: (config: ConfigService) => ({
type: 'postgres',
autoLoadEntities: true,
synchronize: true,
host: config.get<string>('DB_HOST'),
port: config.get<number>('DB_PORT'),
username: config.get<string>('DB_USER'),
password: config.get<string>('DB_PASS'),
database: config.get<string>('DB_NAME'),
}),
}),

De esa forma, en tu .env tenés algo como:

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=nico5329
DB_NAME=postgres

👉 Resumen: sí podés usar process.env, pero en NestJS se recomienda ConfigService porque es más limpio, testeable y escalable.

42.Customización de configuración.
En proyectos más grandes se recomienda crear un archivo especial llamado appConfig donde se tendrán las variables de entorno centralizadas. Agrupa la configuración de distintos modulos en secciones claras, porque por ejemplo podemos tener muchos modulos o funcionalidades con diferentes variables de entorno. Permiten acceder a las variables de entorno con rutas más legibles.

export const appConfig = () => ({
enviroment: process.env.NODE_ENV || 'production',
database: {
host: process.env.DATABASE_HOST || 'localhost',
port: parseInt(process.env.DATABASE_PORT || '5432'),
user: process.env.DATABASE_USER,
password: process.env.DATABASE_PASSWORD,
name: process.env.DATABASE_NAME,
synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
aoutoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
},
});

para cada configuracion agragamos otra propiedad por ejemplo luego de la config de database, podríamos agregar de jwt o de cloudinary, etc.
Luego para usarlo en el appModule, usamos la propiedad load que es capaz de cargar varias configuraciones.
ConfigModule.forRoot({
isGlobal: true,
envFilePath: !ENV ? '.env' : `.env.${ENV}`,
load: [appConfig],
}),

ahora para el modulo de typeOrm que se va a comunicar con la bd usamos el get con el objeto configurado y la obtencion de la propiedad.

TypeOrmModule.forRootAsync({
imports: [ConfigModule],
inject: [ConfigService],
useFactory: (configService: ConfigService) => ({
type: 'postgres',
// entities: [User, Post, MetaOption],
autoLoadEntities: configService.get('database.aoutoLoadEntities'),
synchronize: configService.get('database.synchronize'),
host: configService.get('database.host'),
port: configService.get('database.port'),
username: configService.get('database.user'),
password: configService.get('database.password'),
database: configService.get('database.name'),
// logging: true,
}),
}),
],

se ve como la obtención (get) es mucho más limpia.

43. Register As

Es una función de NestJS que sirve para registrar un conjunto de configuraciones con un nombre (namespace) dentro del ConfigModule.

En otras palabras:

Te permite darle un “nombre” a un grupo de variables.

Permite acceder a ese grupo más fácilmente con configService.get('nombre.propiedad').

Facilita tipado, modularidad y organización de las variables de entorno.
Ejemplo simple

// database.config.ts
import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
host: process.env.DATABASE_HOST || 'localhost',
port: parseInt(process.env.DATABASE_PORT || '5432'),
}));

ConfigModule.forRoot({
isGlobal: true,
envFilePath: !ENV ? '.env' : `.env.${ENV}`,
load: [appConfig, databaseConfig],
}),

Luego, en cualquier parte de tu app:

const dbHost = configService.get('database.host');
const dbPort = configService.get('database.port');

🔹 Lo que hace registerAs:

Toma un nombre ('database').

Toma una función que retorna un objeto con la configuración.

Lo registra en ConfigModule bajo ese nombre.

Esto evita tener un solo objeto gigante y te permite modularizar la configuración por áreas (database, app, auth, mail, etc.).

44. Module configuration and Partial Registration.

Hay ocasiones que la configuración de variables de entorno involucran a un solo modulo. Para esto puede ser necesario, que solo este modulo tenga y sea capaz de leer estas variables.

Por ejemplo necesitamos que el modulo users obtenga un details de una api de google. El env se encontrara en un config en el modulo users

A.se crea.

import { registerAs } from '@nestjs/config';
export default registerAs('profileConfig', () => ({
apiKey: process.env.PROFILE_API_KEY,
}));

B.Se inyecta en el modulo con forFeature.

@Module({
controllers: [UsersController],
providers: [UserService],
imports: [
forwardRef(() => AuthModule),
TypeOrmModule.forFeature([User]),
ConfigModule.forFeature(profileConfig),
],
exports: [UserService],
})
export class UsersModule {}

C.Luego se inyecta en el servicio con @Inject(configProfile.KEY)
se usa KEY que es la clave con la cual se reconoce el registerAs, en este caso "profileConfig".
y se crea el valor para usar en el servicio con un tipo de configuracion private readonly profileConfiguration: ConfigType<typeof profileConfig>,

constructor(
@InjectRepository(User)
private readonly usersRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

)

D. Luego se usa con this.profileConfiguration

45. Validating enviroments variables Joi.
    environment.validation.ts

Usamos un package llamado joi
npm i joI.

Generará un schema de validación para las variables de entorno.
Ejemplo:

import \* as Joi from 'joi';

export default Joi.object({
NODE_ENV: Joi.string()
.valid('development', 'test', 'production', 'staging')
.default('development'),
DATABASE_PORT: Joi.number().port().default(5432),
PORT: Joi.number().port().default(3000),
DATABASE_USER: Joi.string().required(),
DATABASE_PASSWORD: Joi.string().required(),
DATABASE_HOST: Joi.string().required(),
DATABASE_NAME: Joi.string().required(),
DATABASE_SYNC: Joi.boolean().required(),
DATABASE_AUTOLOAD: Joi.boolean().required(),
PROFILE_API_KEY: Joi.string().required(),
});

y al config module de app agregamos esta validación de schema con validationSchema

ConfigModule.forRoot({
isGlobal: true,
envFilePath: !ENV ? '.env' : `.env.${ENV}`,
load: [appConfig, databaseConfig],
validationSchema: enviromenValidation,
}),

Entonces al momento inicializar si existe algun error en las varibales detalla el error.

46. Exception Handling.
    Las excepciones son casi siempre necesarias en casos de comunicación con la bd y el chequeo de datos únicos.

Forma general de las excepciones:
throw new HttpException(response, status)

a.un mensaje principal (string o un objeto),

b.y opcionalmente, un objeto con metadatos adicionales.
🧩 Qué hace cada parte
1️⃣ 'Unable to process your request at the moment please try later'

Este es el mensaje principal que se incluirá en la respuesta JSON.
Sirve para decirle al cliente qué pasó, en este caso:

“No se pudo procesar tu solicitud en este momento, por favor intentá más tarde”.

2️⃣ { description: 'Error connecting to the database' }

Este es un objeto de contexto adicional que Nest incluye en la respuesta.
No es obligatorio, pero podés usarlo para describir dónde o por qué ocurrió el error.
Por ejemplo, si el error fue de conexión a la base de datos.

Esto se traduce a una respuesta JSON parecida a:

{
"statusCode": 408,
"message": "Unable to process your request at the moment please try later",
"error": "Request Timeout",
"description": "Error connecting to the database"
}

Aunque es recomendado utilizar las excepciones predefinidas por nestjs ya que devuelven un objeto más consistente, en caso de que tengamos muchos exceptions.

Ejemplo: en el service de user tenemos que para crear un usuario se busca en la bd para ver si ya existe el email. Ahí podemos tener dos excepciones. 1 error al buscar en la bd 2. Ya existe un mail igual en la bd.

async createUser(createUserDto: CreateUserDto) {
let existingUser;
try {
//Check if the user exist with same mail
existingUser = await this.usersRepository.findOne({
where: { email: createUserDto.email },
});
} catch (error) {
//Aquí se estaría dando un error en la db y es posible que se guarde el error si quisieramos en la db o se mande un mensaje de donde se origina el error.

      throw new RequestTimeoutException(
        'Unable to procces your request at the moment please try later',
        { description: 'Error connecting to the database' },
      );
    }

    //Handle exception}
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email',
        {},
      );
    }
    //Create new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

}

Ahora en la solicitud si hay un email igual la respuesta será {
"message": "The user already exists, please check your email",
"statusCode": 400
}
en el catch tenemos que si no puede conectarse a la db lance un error. Para probar esto podemos detener postgre desde powerShell y enviar la solicitud.

comandos para detener e iniciar postgre v15
net stop postgresql-x64-15
net start postgresql-x64-15

47. Custom exceptions.
    Es recomendado utilizar las de nest porque tendríamos respuestas más consistentes en todo el proyecto, pero en ocasiones puede ser útil el uso de estos, manteniendo la consistencia.

\*Se lanza un httpException que contendrá dos o más valores, el primero debe ser un objeto con el estatus y otros campos que podrían ser relevantes, el segundo argumento debe de ser el codigo de error, status. Y el tercero son las opciones que no serán mostradas como respuesta.
findAll(limit: number, page: number) {

    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endopint does not exist',
        filename: 'user.service.ts',
        linenumber: 84,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permantly moved',
      },
    );

}

48. Transactions.
    Las transacciones son operaciones multiples que se generan en un proceso. Si una de esas operaciones resulta fallida se hace un rollback de todas las operaciones y se vuelve al estado inicial.
    Este tipo de operaciones es necesaria cuando se necesitan hacer varias operaciones.
    EJ: operación bancaria en tres pasos para la transferencia de dinero.

a.Se chequea el saldo de la cuenta.
b.Se debita el saldo de la transferencia.
c.Se acredita a otra cuenta.

Si alguno de estos pasos arroja un error se vuelve al estado inicial.

En typeOrm las transacciones se usan con la clase queryRunner. Cuando se hace uso del queryRunner se hace una conexión unica con la pool connection(conexiones disponibles con la bd). Para generar esta conexión hay una serie de pasos.

a. connect() para conectar con la db
b. starTransaction() para comenzar la transaccion
c. operaciones...
d. try catch block - si es exitosa commitTransaction() genera un commit - si no es exitosa rollbackTransaction() vuelve todo atrás
c. release() libera la conexión

Ej de operación completa. con detalles (userService.ts) para crear varios usuarios.

constructor(
// usa el modulo DataSource para la transacción
private readonly dataSource: DataSource,
) {}

public async createMany(createUsersDto: CreateUserDto[]) {
//crea un array para guardar los usuarios creados, inicialmente vacio.

    let newUsers: User[] = [];

    //Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();

    //Connect Query Runner to datasource
    await queryRunner.connect();

    //Start transaction
    await queryRunner.startTransaction();

    //try catch para hacer un commit o rollback
    try {

        //ciclo for of para declarar user por cada objeto en el array createUserDto
      for (let user of createUsersDto) {
        //para crear y manejar datos se usa la propiedad manager
        //se crea una instancia de la clase
        let newUser = queryRunner.manager.create(User, user);
        //se guarda en la db, no definitivamente
        let result = await queryRunner.manager.save(newUser);
        //se pushea al array inicialmente vacio
        newUsers.push(result);

      }
       //If succesful commit
        await queryRunner.commitTransaction();
        //retorno para confirmación
      return newUsers;
    } catch (error) {
      //If unseccesful rollback
      await queryRunner.rollbackTransaction();
    } finally {
      //Release connection
      await queryRunner.release();
    }

}

49. Creación de multiples proveedores(servicios)
    Cuando nuestros servicios crecen demasiados el código puede llegar a ser ilegible. Por eso es necesarios crear diferentes proveedores. Reglas generales para cuando conviene crear nuevos proveedores:

🔹 Cuando el servicio tiene responsabilidades distintas → por ejemplo, separar la lógica de transacciones o notificaciones del CRUD principal.

🔹 Cuando el servicio se vuelve muy grande o complejo → si tiene muchos métodos o mezcla distintas tareas, conviene dividirlo.

🔹 Cuando cierta lógica puede reutilizarse en otros módulos → como un EmailService o FileService.

🔹 Cuando querés aislar código de infraestructura → como manejo de base de datos, colas o transacciones (QueryRunner, etc.).

🔹 Cuando querés mejorar la testabilidad → separar partes hace más fácil probarlas individualmente.

a.Crear provider con cli.

nest g pr user/providers/users-create-many.provider --flat --no-spec

b. Una vez creado el injectable lo llamamos en el service con el constructor con private readonly. Luego lo utilizamos retornandoló.

En este caso user.service usa users-create-many.provider para la operación multiple con el queryRunner para que no quede tan cargado el servicio original.

en este tipo de opereaciones en los que vamos a mandar un array de objetos es necesario validar todos los objetos dentro del array por eso es necesario agregar otro dto porque no basta solo con poner [] luego de dto singulares ya definidos.
Por ejemplo para enviar varios usuarios el nuevo dto es:
export class CreateManyUsersDto {
@ApiProperty({ type: 'array', required: true, items: { type: 'User' } })
@IsNotEmpty()
@IsArray()
@ValidateNested({ each: true })
@Type(() => CreateUserDto)
users: CreateUserDto[];
}

51. Pagination.

El paginado es una practica común en el backend de varios servicios. Comunmente para un selector de paginado tipo así
⏮ ‹ 1 2 [3] 4 5 › ⏭
se retorna algo así:
{
"data": [], // Array of Posts
"meta": {
"itemsPerPage": 1,
"totalItems": 4,
"currentPage": 1,
"totalPages": 4
},
"links": {
"first": "http://localhost:3000/posts/?limit=1&page=1",
"last": "http://localhost:3000/posts/?limit=1&page=4",
"current": "http://localhost:3000/posts/?limit=1&page=1",
"next": "http://localhost:3000/posts/?limit=1&page=2",
"previous": "http://localhost:3000/posts/?limit=1&page=1"
}
}

Para definir la respuesta o el return que vamos a obtener recordá que se definen las interfaces por ejemplo:

interface User {
id: number;
name: string;
age: number;
}

const user: User = {
id: 1,
name: 'Nico',
// age falta
};

function getUserInfo(userId: number): User {
const dbResult = {
id: userId,
name: 'Nico',
// age falta
};

return dbResult; // ❌ TypeScript da error: Property 'age' is missing
}

52.Creación Pagination genérico.
(pagination.provider y module)
El objetivo es crear un servicio genérico ya que es una función que comunmente se utiliza en varios lugares de servicio.

En paginador del proyecto creamos un modulo con un provider ya que utiliza repositorios(genéricos) y por buenas practicas de nest es necesario generar un modulo.

@Injectable()
export class PaginationProvider {
public async paginatedQuery<T extends ObjectLiteral>(
paginationQuery: PaginationQueryDto,
repository: Repository<T>,
) {
paginationQuery.page = paginationQuery.page ?? 1;
paginationQuery.limit = paginationQuery.limit ?? 5;
const results = await repository.find({
skip: (paginationQuery.page - 1) _ paginationQuery.limit, //(first page - 1) _ limit
take: paginationQuery.limit,
});
return results;
}
}

//<T extends ObjectLiteral> permite aplicar cualquier objeto clave valor
// PaginationQueryDto, page y limit
//Repository<T> forma genérica utilizada para reutilizar

@Module({ providers: [PaginationProvider], exports: [PaginationProvider] })
export class PaginationModule {}

Luego lo importamos y lo ponemos en el constructor del nuevo servicio.

53.Response Object for pagination.

Siguiendo con el paginado necesitamos que este nos de una respuesta con la forma escrita en el punto 51. Para esto uno de los puntos necesarios es la creación de urls para el salto entre paginas.

Para lograr esto hacemos uso de las request tanto @Request(que se usa en controladores) y REQUEST para servicios y providers. En nuestro provider de pagination.

🟩 1. @Request() — en controladores

Es un decorador de @nestjs/common.
Se usa cuando estás dentro de un controller o un handler (un método que maneja una ruta).

Ejemplo:

import { Controller, Get, Request } from '@nestjs/common';

@Controller('users')
export class UserController {
@Get()
getUser(@Request() req) {
console.log(req.user);
return req.user;
}
}

👉 Es ideal para rutas HTTP porque Nest te inyecta automáticamente el objeto req (de Express o Fastify).
⚙️ No necesitás inyección de dependencias.

🟨 2. REQUEST — en providers o servicios

Es un token de inyección del paquete @nestjs/core.
Se usa cuando no estás en un controlador, por ejemplo en un service o guard, y necesitás acceder a la request actual.

Ejemplo:

import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
constructor(@Inject(REQUEST) private readonly request: Request) {}

getCurrentUser() {
return this.request.user;
}
}

El obejto de nuestro paginade devuelve la data, metaDatos de paginado y firs, last, current, next, previous pages con los links pertinentes.
Para construir estos links dinamicamente en pagination.provider.ts:

a.Inyectamos el Request:
@Inject(REQUEST)
private readonly request: Request.

b.Creamos la url dinamicamente con ayuda de este modulo.
/\*\*
_ Create the request URLS
_/
const baseURL =
this.request.protocol + '://' + this.request.headers.host + '/';
const newUrl = new URL(this.request.url, baseURL);
console.log(newUrl);

1️⃣ this.request.protocol + '://' + this.request.headers.host + '/' es como: http+://+localhost:3000/

2️⃣ new URL(this.request.url, baseURL)

Aquí se está creando un objeto URL de JavaScript, que nos permite trabajar fácilmente con URLs completas.

this.request.url → contiene solo la ruta y query string de la petición, por ejemplo "/users?page=2".

baseURL → es la base que construimos antes ("http://localhost:3000/").

new URL(this.request.url, baseURL) combina ambos y genera:

URL {
href: 'http://localhost:3000/users?page=2',
origin: 'http://localhost:3000',
pathname: '/users',
search: '?page=2',
...
}

Con este objeto URL ya puedes acceder fácilmente a partes del URL como:

.pathname → '/users'

.search → '?page=2'

.origin → 'http://localhost:3000'

.href → 'http://localhost:3000/users?page=2'

De esa forma luego se puede implementar la logica de paginado que se datalla en el codigo del provider.

54.User Authentication.

Generalmente para guardar usuarios las contraseñas se hashean a través de algoritmos. Y siempre, que se quiera acceder con el mismo usuario, esta password será verificada de nuevo por el algoritmo para chequear la igualdad.
Adding salt a un hash es agregar más caracteres aleatorios para complicar el acceso al descifrado de la password.

Para empezar vamos a generar dos providers. Hashing provider y bcrypt provider, separarlos en dos es para que en caso de que en el futuro se quiera usar otra libreria se podrá cambiar más facilmente.

$ nest g pr auth/providers/hashing.provider.ts --flat --no-spec
$ nest g pr auth/providers/bcrypt.provider --flat --no-spec

52. Abstract y uso en authModule.

Las interfaces abstractas son como moldes que serán utilizados por proveedores. La interfaz define las funciones o el molde general y el proveedor define que ira dentro de ese molde.

Cuando marcás una clase como **abstract**, significa que no puede ser instanciada directamente, sino que sirve como plantilla o contrato para otras clases.

En el ejemplo:

export abstract class HashingProvider {
abstract hashPassword(data: string | Buffer): Promise<string>;
abstract comparePassword(
data: string | Buffer,
encrypted: string,
): Promise<boolean>;
}

Esta clase dice:

“Cualquier clase que herede de mí debe implementar estos dos métodos (hashPassword y comparePassword).”

Pero no dice cómo hacerlo —eso lo decide cada clase concreta (como BcryptProvider).

💥 Por qué es útil

Esto se usa mucho en NestJS para definir interfaces de comportamiento entre proveedores.
Por ejemplo:

HashingProvider define qué hay que hacer (hash y comparar contraseñas).

BcryptProvider define cómo se hace (usando bcrypt).

Si después querés cambiar a Argon2 o SHA-256, podés crear otro proveedor que implemente HashingProvider sin cambiar el resto del código.

🧩 Ejemplo más realista
@Injectable()
export class BcryptProvider extends HashingProvider {
async hashPassword(data: string | Buffer): Promise<string> {
return await bcrypt.hash(data.toString(), 10);
}

async comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
return await bcrypt.compare(data.toString(), encrypted);
}
}

Y luego en tu servicio podrías inyectar el HashingProvider sin importar cuál sea la implementación real:

@Injectable()
export class UsersService {
constructor(private readonly hashingProvider: HashingProvider) {}

async createUser(password: string) {
const hashed = await this.hashingProvider.hashPassword(password);
// guardar el usuario con su contraseña hasheada
}
}

Así, si un día querés usar otra librería, solo cambiás el provider en tu módulo, no todo tu código.

flujo de ejemplo:

UsersModule
↓
UsersService
↓
HashingProvider (abstracto)
↓
BcryptProvider (implementación concreta)

luego para exportarlo desde el módulo de hashing o auth(auth.module.ts)

Ejemplo con hashingModule:
@Module({
providers: [
{
provide: HashingProvider, // contrato abstracto
useClass: BcryptProvider, // implementación concreta
},
],
exports: [HashingProvider], // exportás el contrato para que otros módulos puedan usarlo
})
export class HashingModule {}

53.Bcrypt.
npm i bcrypt@5.1.1

export class BcryptProvider implements HashingProvider {
async hashPassword(data: string | Buffer): Promise<string> {
/**
_ Generate Salt
_/
const salt = await bcrypt.genSalt();
return bcrypt.hash(data, salt);
}
comparePassword(
data: string | Buffer,
encrypted: string,
): /**

- Compare
  \*/
  Promise<boolean> {
  return bcrypt.compare(data, encrypted);
  }
  }

🧩 1. Qué pasa cuando se crea una contraseña

Cuando ejecutás:

const salt = await bcrypt.genSalt();
const hash = await bcrypt.hash(password, salt);

bcrypt hace esto internamente:

Genera un “salt” — una cadena aleatoria que se usará para hacer único el hash.
Ejemplo:

$2b$10$U8s7B3QZm9v4Jsl9jGnOqe

$2b$ → versión del algoritmo.

10 → costo (número de rondas).

El resto es el salt.

Combina la contraseña + el salt, y aplica el algoritmo de hashing de bcrypt (que es más complejo que un simple SHA).
Así genera algo como:

$2b$10$U8s7B3QZm9v4Jsl9jGnOqe5cDLK6jh1dFQrkf0fJ3b3K2S5Bfpq.e

Este valor incluye dentro de sí mismo el salt y el costo, por eso después no hace falta guardarlos por separado.

🔐 2. Cómo bcrypt compara contraseñas

Cuando más tarde el usuario inicia sesión y vos hacés:

bcrypt.compare(plainPassword, hashedPassword)

bcrypt hace esto internamente:

Extrae el salt y el costo del hash almacenado (hashedPassword).

Hashea la contraseña en texto plano (plainPassword) usando ese mismo salt y costo.

Compara ambos hashes — si son iguales, devuelve true; si no, false.

Por eso vos nunca tenés que preocuparte por guardar o pasar el salt.
El hash ya lo contiene.

Y el flujo sería:

// 1️⃣ Cuando el usuario se registra:
const hashedPassword = await bcryptProvider.hashPassword('miContraseña123');
// Guardás hashedPassword en la DB

// 2️⃣ Cuando inicia sesión:
const isMatch = await bcryptProvider.comparePassword('miContraseña123', hashedPassword);

if (isMatch) {
console.log('Contraseña correcta ✅');
} else {
console.log('Contraseña incorrecta ❌');
}

54.User signUp.
Para registrarse se usará el servicio de en authmodule y para signIn authModule hará uso de useService, entonces se injectan en forma de dependencia circular con forwardRef para que no arroje error. En el proyecto la creación de usuarios tendrá un provider separado dentro usersModule para hacer legible el userService, este último tendrá un metodo que usa este provider.

@Injectable()
export class CreateUserProvider {
constructor(
/\*\*
_ Inject userRepository
_/
@InjectRepository(User)
private readonly usersRepository: Repository<User>,

    /**
     * Inject hashing provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

) {}

async createUser(createUserDto: CreateUserDto) {
let existingUser;
try {
//Check if the user exist with same mail
existingUser = await this.usersRepository.findOne({
where: { email: createUserDto.email },
});
} catch (error) {
//Aquí se estaría dando un error en la db y es posible que se guarde el error si quisieramos en la db o se mande un mensaje de donde se origina el error.

      throw new RequestTimeoutException(
        'Unable to procces your request at the moment please try later',
        { description: 'Error connecting to the database' },
      );
    }

    //Handle exception}
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email',
        {},
      );
    }

    //Create new user
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.usersRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to procces your request at the moment please try later',
        { description: 'Error connecting to the database' },
      );
    }

}
}

lo único diferente es que en la creación de usuario la contraseña se hashea.

55.SignIn Controller en UserModule para AuthModule, luego token.

(find-one-user-by-email.provider)
$ nest g pr users/providers/find-one-user-by-email.provider --flat --no-spec

Generamos un provider para encontrar usuario con email. Lo agregamos en userService y lo usamos en el AuthService.
Esta gerarquización es una buena practica y mantiene todo ordenado.
Los archivos son find-one-user-by-email.provider busca usuario, se injecta en user.service -> luego authService confirma usuario y da dato booleano.

56.Completing sigIn Method.

Creamos un provider llamado sign-in.provider
$ nest g pr auth/providers/sign-in.provider --flat --no-spec

ponemos la logica de signIn ahí, luego inyectamos en authservice.

Puntos destacables:
a. Comparación de hash y password.
isEqual = await this.hashingProvider.comparePassword(
signInDto.password,
user?.password,
);

b. Modificación de respuesta en controlador de 201 created (respuesta predefinidad por POST) a 200 OK. con decorador.
@Post('sign-in')
@HttpCode(HttpStatus.OK)
async signIn(@Body() signInDto: SignInDto) {
return await this.authService.signIn(signInDto);
}

57. JWT
    Es un sistema para que el usuario se mantenga logeado, permitiendo hacer consultas sin tener que repetir el proceso.
    Como respuesta a un login correcto el backend envía el jwt que se guardará en el front para luego ser mandado en cada consulta hacia el back por lo general en el header.
    Authorization: Bearer <token>

npm i @nestjs/jwt

Entonces el jwt se devolverá cada que el usuario haga login.

Dentro de las configuraciónes tendremos que crear variables de entorno para chequear la veracidad de generación del token.

JWT_SECRET=
JWT_TOKEN_AUDIENCE=
JWT_TOKEN_ISSUER=
JWT_ACCES_TOKEN_TTL=

JWT_SECRET
//podemos sacarla de alguna web de generado de codigo.
🔹 Significado: Clave usada para firmar y verificar el token.

🔹 Ejemplo: mi_clave_super_segura

JWT_TOKEN_AUDIENCE

🔹 Significado: Público destinatario del token (quién debería usarlo).

🔹 Ejemplo: https://nicolas-app.com

JWT_TOKEN_ISSUER

🔹 Significado: Identifica quién emitió el token (el emisor).

🔹 Ejemplo: nest-backend

JWT_ACCESS_TOKEN_TTL

🔹 Significado: Tiempo de vida del token en segundos (cuánto dura antes de expirar).

🔹 Ejemplo: 3600

Para obtener las variables de entorno podemos agregarlas a una configuración para modulo especifico. (jwt.config)
export default registerAs('jwt', () => {
return {
secret: process.env.JWT_SECRET,
audience: process.env.JWT_AUDIENCE,
issuer: process.env.JWT_ISSUER,
accessTokenTtl: parseInt(process.env.JWT_ACCES_TOKEN_TTL ?? '3600', 10),
};
});

y luego utilizarla en authmodule:

@Module({
controllers: [AuthController],
providers: [
AuthService,
{
provide: HashingProvider, // contrato abstracto
useClass: BcryptProvider, // implementación concreta
},
SignInProvider,
],
exports: [AuthService, HashingProvider],
imports: [
forwardRef(() => UsersModule),
ConfigModule.forFeature(jwtConfig),
JwtModule.registerAsync(jwtConfig.asProvider()),
],
})

a.Lo importamos con ConfigModule.forFeature para poder usar las claves en el servicio y terminar de usar el servicio de JWT con authservice. Luego por otra parte le pasamos a JwtModule la config que creamos, con asProvider() que inyecta las variables directamente (usado con librerias).

terminamos el signIn con los datos para generar le token, y lo devolvemos. Archivo: sign-in-provider.ts

el token contiene muchos datos del usuario y se pueden verificar en https://www.jwt.io

58.Guards

El acces token guard analizará el request extraerá el token y dará autorización.
Los guards pueden aplicarse a todo un controlador como a una sola ruta.

nest g guard auth/guards/acces-token --no-spec
crea un guardia tipico de nest que aplica la interfaz canActivate usada para crear guards, que controlan las peticiones.

🚦 ¿Qué hace canActivate?

El método canActivate() es obligatorio cuando implementás la interfaz CanActivate.
Se ejecuta antes de que NestJS llame al controlador o al handler de una ruta.

Su propósito es decidir si se permite o se bloquea el acceso a esa ruta.
Debe devolver:

true → si el acceso está permitido

false → si el acceso está denegado

o una Promise / Observable que resuelva a true o false.

59.acces-token.guard.ts

Obtiene la request actual:

const request = context.switchToHttp().getRequest();

Saca el token del header Authorization:

const token = this.extractRequestFromHeader(request);

Si no hay token, lanza un error:

if (!token) throw new UnauthorizedException();

Verifica que el token sea válido:

const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration);

Guarda el contenido del token (payload) en la request:

request[REQUEST_USER_KEY] = payload;

→ Esto permite que los controladores accedan al usuario autenticado con req.user (o req[REQUEST_USER_KEY]).

Si todo sale bien, deja pasar la solicitud:

return true;

Si el token es inválido, lanza UnauthorizedException.

⚙️ En resumen corto:

Este guard verifica el token JWT de la cabecera.
➡️ Si es válido, guarda los datos del usuario en request y deja continuar.
➡️ Si no, lanza un error 401 (Unauthorized).

60.Usando el guard en un modulo específico.

Se necesita (al module) darle acceso al jwtService por eso es necesario importarlo.
imports: [
ConfigModule.forFeature(jwtConfig),
JwtModule.registerAsync(jwtConfig.asProvider()),]

Luego lo usamos en el controlador con el metodo:

En este caso para crear muchos usuarios
@UseGuards(AccesTokenGuard)
@Post('create-many')....

O si queremos lo ponemos para todo el controlador.

@UseGuards(AccesTokenGuard)
@Controller('users')
export class UsersController

Para usarlo:

POST http://localhost:3000/users/create-many
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIwLCJlbWFpbCI6ImFndXN0aW5hLm1hcnRpbmV6QGV4YW1wbGUuY29tIiwiaWF0IjoxNzYxNjE1NTkzLCJleHAiOjE3NjE2MTkxOTMsImF1ZCI6ImxvY2FsaG9zdDozMDAwIiwiaXNzIjoibG9jYWxob3N0OjMwMCJ9.CtmkFr6VxD-iqnTj6vPyl5Z9KbWNjtxQ4IzoWDEt5ns
{
"users": [.....]}

61. Aplicando el guar de formal global.
    Se aplica este objeto en el proveedor de app module. APP_GUAR es una key de nest.

providers: [AppService, { provide: APP_GUARD, useClass: AccesTokenGuard }]
imports: [
ConfigModule.forFeature(jwtConfig),
JwtModule.registerAsync(jwtConfig.asProvider()),]

62. Decorators (Auth).
    Los decoradores generan metadatos para proporcionarlos a nestjs y saber como operar el codigo. Por ejemplo pueden ser de clases @Controller, metodos @Post, o parametros @Body, etc.

Estos decoradores cambian el comportamiento del framework y puden utilizarse a nuestro favor por ejemplo en los casos de guards, seteando valores según que queramos proteger o no. Los guards analizaran estos datos.

Se pueden crear metadatos personalizados con Reflect.metadata() o SetMetadata(), para asociar valores o permisos personalizados a controladores o métodos.

63.Creación de decorador para guard.

nest g d auth/decorator/auth --flat --no-spec

genera un guardía generico que asigna un valor a una clave.
Nosotros podemos modificarlo para que estas asignaciones sean a valores seguros.

auth.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../constants/auth-type.enum';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
export const Auth = (...authType: AuthType[]) =>
SetMetadata(AUTH_TYPE_KEY, authType);

Luego solo los importamos a donde querramos y los usamos llamando al decorador y dando un valor.

@Auth(AuthType.None) por ejemplo.

64. Guardia de autenticación.
    Authentication guard será nuestro guardia global. Y usará a accesTokenGuard, servicio de google u otros guardias o modulos relacionados.

@Auth() _Decorador personalizado_ --> None || Bearer
|
v
Authentication Guard--> Accestoken guard

$ nest g guard auth/guards/authentication --no-spec

authentication.guard.ts
a- Tipo default Bearer.
b- AuthTypeGuardMap definido como clave valor con Record AuthType:CanActivate[]
c-Reflector lee metadatos y accesTokenGuard guardia de tokens.
d- metodo asincrono canActivate es usado por los guardias de nestjs y este usa el contexto.
Obtiene los metadatos usando el reflector y les asigna la clave authTypes, getAllAndMerge busca la clave en el controlador y el metodo dandole prioridad el metodo.
Devuelve un array tipo [1,0] porque nest no muestra las claves enums.
e- Se hace un map con los valores y se accede al valor de AuthTypeGuardMap y se imprime.
f- el loop recorre los guardias espera resolver una promesa pasada a cada guardia con su metodo canActivate(los dos tienen) si canActivate es true devuelve true y sale, sino devuelve un unauthorized.

65. Custom decorator para extraccion del payload
    Documentación: https://docs.nestjs.com/custom-decorators

export const ActiveUser = createParamDecorator(
(field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
const request = ctx.switchToHttp().getRequest();
const user: ActiveUserData = request[REQUEST_USER_KEY];
return field ? user?.[field] : user;
},
);

extrae el request con la clave que tiene todo el payload, luego para usarlo +
@Post()
create(@ActiveUser() user: ActiveUserData) {
console.log('user?', user);}

key of del decorador nos permite obtener las claves indicadas en ActiveUserData en esta caso sub | email
ej: create(@ActiveUser("sub") user: ActiveUserData)

66- Provider de post con uso del decorador que extrae datos del token.
nest g pr posts/providers/create-post.provider --flat --no-spec

67-Refresh token.
El refresh token es almacenado en el frontend al igual que el jwt, luego cuando jwt está por expirar este refres se manda a una dirección específica que lo valida y entrega otro jwt.

Agregammos la variable con duración mayo (refresh) JWT_REFRESH_TOKEN_TTL=86400, a las de entorno y modificamos jwt.config y environment.validation para contengan el nuevo valor y que lo validen. Creamos en refreshToken.dto.ts.

nest g pr auth/providers/generate-tokens.provider --flat --no-spec
va a generar los dos tipos de token haciendo uso de la entidad user y el jwt configuration. El primero con menor tiempo de vida

nest g pr auth/providers/refresh-tokens.provider --flat --no-spec
hará uso de generatetoken pero será para refrescar. Por el body del controlador vendrá el refresh que se usará en el veryfyAsync. Esto devuelve el payload. Del payload obtenemos el usuario por findById. Y luego entregamos el usuario al generate token provider.

Luego ponemos el refreshToken como proveedor de authService y generamos el controlador.
@Post('refresh-tokens')
@HttpCode(HttpStatus.OK)
async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
return await this.authService.refreshTokens(refreshTokenDto);
}

La solicitud necesitará tanto un Bearer como un body con el refresToken.

68. Google authentication
    Logica de la autenticación de google.

a.En el front se iniciará el sign in a través de un botón que redigira al modal de iniciar sesión de google.
b.Se inicia el proceso de inicio de sesión, google genera un jwt loginTicket que se envíará al back.
c.Se envía el jwt a la nestjs api que valida el google token.
d.Proceso de chequeo de existencia de usuario, sino se crea uno. Luego se genera un nuevo token perteneciente a la api para poder operar.

69. Credenciales de google cloud.
    se creará el la api de nuestra aplicación con cloud de google.
    luego en las variables de entorno se crearán dos variables con códigos dados por google al configurar al auth0.

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

Las agregamos al archivo de configuración de las variables de JWT.

se usa una libreria para el uso de google auth.
npm i google-auth-library

Crearemos dos archivos:
1- Uno que va controlador, para manejar las rutas para google athentication.
2- Otro service files.

npm nest g co auth/social/google-authentication --flat --no-spec
nest g s auth/social/providers/google-authentication.service --flat --no-spec

generamos un dto para el token de google que vendrá del navegador se extraera el token y se iniciará sesión en caso de que exista usuario. Por eso es necesario cambiar la entidad usuario y poner nullable true y "?" en la contraseña ya que los usuario creados con google no tendrán contraseña, luego se puede agregar.

@Column({ type: 'varchar', length: 96, nullable: true, unique: true })
password?: string;

y agregamos

@Column({ type: 'varchar', length: 96, nullable: true, unique: true })
googleId?: string;

70.Inicializadno google auth.
archivo:
google-authentication-service.service

a) Constructor

✔ Recibe la configuración inyectada:

@Inject(jwtConfig.KEY)
private readonly jwtConfiguration: ConfigType<typeof jwtConfig>

👉 En este paso solo se guardan los valores: clientId, clientSecret, etc.

No se crea el cliente de Google todavía.

b) Propiedad de clase
private oauthClient: OAuth2Client;

✔ Declara una variable en la clase
❌ No asigna nada
❌ No instancia nada

👉 Solo dice: “voy a tener un OAuth2Client acá”.

c) onModuleInit()
onModuleInit() {
const clientId = this.jwtConfiguration.googleClientId;
const clientSecret = this.jwtConfiguration.googleClientSecret;
this.oauthClient = new OAuth2Client(clientId, clientSecret);
}

✔ Se ejecuta cuando Nest ya terminó de inicializar el módulo
✔ Crea el cliente de Google con las credenciales
✔ Lo asigna a this.oauthClient
👉 Ahora sí el servicio queda completamente listo.

d) ¿Para qué sirve this.oauthClient?

Sirve para:

verificar tokens de Google

validar usuarios

obtener info del usuario

manejar el flujo OAuth2

Ejemplo típico posterior:

const ticket = await this.oauthClient.verifyIdToken({
idToken,
audience: this.jwtConfiguration.googleClientId,
});

71.Implementación de la autenticación de google.

nest g pr users/providers/find-one-by-google-id.provider --flat --no-spec

72.Google authentication service.
Recibe el token de google, lo verifica, obtiene datos del payload, busca un usuario y si no existe crea uno.

nest g pr users/providers/create-google-user.provider --flat --no-spec

para usar un metodo de creación de usuarios para google.

73.Interceptor y serialization.
✅ Qué es un Interceptor en NestJS

Un Interceptor es una clase que se ejecuta antes y/o después de que un controlador maneje una petición.

Es como un middleware con superpoderes, pero ubicado dentro del ciclo interno de Nest.

Sirve para:

Transformar la respuesta antes de enviarla

Modificar la request

Agregar lógica de logging

Manejar errores globalmente

Medir tiempos de ejecución

Serializar objetos (como el ClassSerializerInterceptor)

Cachear respuestas

Ejemplo visual del flujo:
Request → Interceptor → Controller → Service → Response → Interceptor → Cliente

🟦 Qué es "Serialization" (Serialización)

La serialización es el proceso de transformar un objeto interno de la app (por ejemplo, una entidad de TypeORM) en un objeto que se pueda enviar al cliente (JSON limpio).

En Nest se usa para:

Ocultar campos sensibles (password, tokens, etc.)

Renombrar propiedades

Filtrar datos innecesarios

Formatear objetos antes de devolverlos

Nest trae un interceptor listo para esto:

👉 ClassSerializerInterceptor

Funciona junto con decoradores de class-transformer.

Ejemplo:

import { Exclude } from 'class-transformer';

export class UserEntity {
id: number;
email: string;

@Exclude()
password: string;
}

Esto hace que password NO aparezca en la respuesta, aunque existe en el objeto.

74. Aplicando los interceptores para serializar y ocultar campos sensibles.

En el controlador de creación de usuario user.controller.ts aplicamos el @UseInterceptors(ClassSerializerInterceptor)
Luego en la entidad user ponemos el decorador @Exclude() a los campos que no queremos que aparezcan; como por ejemplo en user entity en googleId o password.

75. Global Data Interceptor.
    Vamos a generar un interceptor para aplicar un formato a todas las respuestas. El interceptor generará respuestas generales aplicadas a toda la aplicación en formato:
    { apiVersion: string, data: {}}

nest g interceptor common/interceptors/data-response --no-spec
Los interceptores implementan una interface que espera un contexto y una función handler.

Los interceptores trabajan con observables llamados RxJS. Ejemplo mental:

➡️ Un Promise es como pedir un delivery y esperar sentado.
No podés cambiar nada durante el proceso.

➡️ Un Observable es como ver el paquete en tiempo real mientras avanza.
Podés espiar, modificar, cancelar, etc.

Promesas sirven para obtener un valor una vez.
Observables sirven para manipular, transformar o interceptar flujos de datos.
Eso es EXACTAMENTE lo que un interceptor necesita hacer.

return next.handle().pipe(tap((data) => console.log(data)));

pipe metodo de RxJs para encadenar operadores, tap observa el valor devuelto por el controlador.

Lo implementamos en main.ts
// Add global Interceptor
app.useGlobalInterceptors(new DataResponseInterceptor());

76.Implementación global con datos en .env
//En app.module.ts
{ provide: APP_INTERCEPTOR, useClass: DataResponseInterceptor },
Para implementarlo globalmente (es otra forma)

//data-response.interceptor.ts
@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
constructor(private readonly configService: ConfigService) {}
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
console.log('Before...');
return next.handle().pipe(
map((data) => ({
apiVersion: this.configService.get('appConfig.apiVersion'),
data: data,
})),
);
}
}
el metodo map a diferencia del tap puede modificar lo devuelto por el controlador. Lu
