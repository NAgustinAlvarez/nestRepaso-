/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @Inject(forwardRef(() => AuthService))
    private readonly authservice: AuthService,

    private readonly configService: ConfigService,
  ) {}

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
  getUsers(): string {
    return 'this is a users service';
  }

  findAll(limit: number, page: number) {
    const isAuth = this.authservice.isAuth();
    const environment = this.configService.get<string>('S3_BUCKET');
    console.log(environment);
    console.log(process.env.NODE_ENV);
    // console.log(isAuth);
    return [
      { firstName: 'John', email: 'john@doe.com' },
      { firstName: 'Alice', email: 'alice@doe.com' },
    ];
  }

  async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }
}
