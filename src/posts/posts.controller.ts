import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { UserService } from 'src/users/providers/users.service';
import { GetUsersParamDto } from 'src/users/dtos/get-user.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService,
  ) {}

  @Get('/:id')
  getPost(@Param('id', ParseIntPipe) userId: GetUsersParamDto) {
    return this.userService.findOneById(userId);
  }
  @Get()
  getAllPost() {
    return this.postsService.findAll();
  }
  @Post()
  createPost(@Body() body: CreatePostDto) {
    console.log(body);
    return 'okaay';
  }
  @Patch()
  updateUser(@Body() patchPost: PatchPostDto) {
    console.log(patchPost);
  }
  // @Get()
  // findAll() {
  //   return this.postsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.postsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postsService.update(+id, updatePostDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postsService.remove(+id);
  // }
}
