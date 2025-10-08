/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  Inject,
  forwardRef,
  RequestTimeoutException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
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
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private readonly authservice: AuthService,

    private readonly configService: ConfigService,
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
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
        'Unable to procces your request at the moment pleas try later',
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
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
  getUsers(): string {
    return 'this is a users service';
  }

  findAll(limit: number, page: number) {
    const isAuth = this.authservice.isAuth();
    const environment = this.configService.get<string>('S3_BUCKET');
    console.log(environment);
    console.log(process.env.NODE_ENV);
    console.log(this.profileConfiguration.apiKey);
    // console.log(isAuth);
    return [
      { firstName: 'John', email: 'john@doe.com' },
      { firstName: 'Alice', email: 'alice@doe.com' },
    ];
  }

  async findOneById(id: number) {
    let user: FetchUserDto | null;
    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      //solo errores de la db
      throw new RequestTimeoutException();
    }

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
