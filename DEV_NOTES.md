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

    Luego para usarlo por ejemplo en un servicio.
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

41. Conditionally loading enviroment
