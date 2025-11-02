/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UserService } from './providers/users.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { AccesTokenGuard } from 'src/auth/guards/acces-token/acces-token.guard';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/constants/auth-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.userService.findAll(page, limit);
  }

  @Get('/:id')
  @ApiOperation({
    description: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({ status: 200, description: 'Users fetched succesfully' })
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
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Número de página a devolver en la paginación',
    example: 1,
  })
  getUsers(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.findOneById(id);
  }

  @Post()
  @Auth(AuthType.None)
  createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AccesTokenGuard)
  @Post('create-many')
  async createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return await this.userService.createMany(createManyUsersDto);
  }

  @Patch()
  patchUsers(@Body() bodyPatch: PatchUserDto) {
    console.log(bodyPatch);
    return 'You sent a patch request';
  }
}
