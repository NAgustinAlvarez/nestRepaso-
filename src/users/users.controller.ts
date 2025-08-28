/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UserService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @Get('/:id')
  getUsers(
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.userService.findAll(getUserParamDto, limit, page);
  }
  @Post()
  createUsers(@Body() body: CreateUserDto) {
    console.log(body);
    return 'You sent a Post Request';
  }

  @Patch()
  patchUsers(@Body() bodyPatch: PatchUserDto) {
    console.log(bodyPatch);
    return 'You sent a patch request';
  }
}
