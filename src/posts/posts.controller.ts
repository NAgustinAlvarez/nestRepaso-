/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { UserService } from 'src/users/providers/users.service';
import { GetUsersParamDto } from 'src/users/dtos/get-user.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostDto } from './dtos/get-post.dto';
import { request } from 'http';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/constants/auth-type.enum';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getPost(
    @Query() postQuery: GetPostDto, //con startData, endDate, limit y page
  ) {
    console.log(postQuery);
    return this.postsService.findAll(postQuery);
  }

  @Get('/:userId')
  getPostUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() postQuery: GetPostDto, //con startData, endDate, limit y page
  ) {
    console.log(postQuery);
    return this.postsService.findAll(postQuery, userId);
  }

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    console.log('user?', user);
    return this.postsService.create(createPostDto, user);
  }

  @Delete()
  deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }

  @Patch()
  updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.update(patchPostDto);
  }
}
