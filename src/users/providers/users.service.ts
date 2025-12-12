/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  Inject,
  forwardRef,
  RequestTimeoutException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { FetchUserDto } from '../dtos/fetch-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUserInterface } from '../interfaces/google-user.interface';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    /**
     * Inject AuthService
     */
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    /**
     * Inject ConfigService
     */
    private readonly configService: ConfigService,

    /**
     * Inject profile configuration
     */
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * Inject UsersCreateManyProvider
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    /**
     * Inject CreateUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,

    /**
     * Inject FindOneUserByEmailProvider
     */
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    /**
     * Inject findOneByGoogleIdProvider
     */
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
    /**
     * Inject createGoogleUserProvider
     */
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.createUserProvider.createUser(createUserDto);
    return user;
  }

  getUsers(): string {
    return 'this is a users service';
  }

  findAll(limit: number, page: number) {
    //ejemplos de funcionalidades
    // const isAuth = this.authservice.isAuth();
    // const environment = this.configService.get<string>('S3_BUCKET');
    // console.log(environment);
    // console.log(process.env.NODE_ENV);
    // console.log(this.profileConfiguration.apiKey);
    // // console.log(isAuth);
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

  async findOneById(id: number) {
    let user: User | null;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      //solo errores de la db
      throw new RequestTimeoutException(
        'Unable to procces your request at the moment please try later',
        { description: 'Error connecting to the database' },
      );
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }
  async findOneUserByEmail(email: string): Promise<User> {
    return await this.findOneUserByEmailProvider.findOneUserByEmail(email);
  }
  async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }
  async createGoogleUser(googleUser: GoogleUserInterface) {
    console.log('EN GOOGLE USER', googleUser);
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
