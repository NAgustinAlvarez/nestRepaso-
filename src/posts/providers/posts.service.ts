/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOptions } from 'src/meta-options/meta-option.entity';
import { UserService } from 'src/users/providers/users.service';
import { GetUsersParamDto } from 'src/users/dtos/get-user.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOptions)
    private readonly metaOptionRepository: Repository<MetaOptions>,
    private readonly userService: UserService,
  ) {}
  async create(createPostDto: CreatePostDto) {
    //create metaOptions before post
    // let metaOptions = createPostDto.metaOptions
    //   ? this.metaOptionRepository.create(createPostDto.metaOptions)
    //   : null;
    // if (metaOptions) {
    //   await this.metaOptionRepository.save(metaOptions);
    // }
    //create post
    let post = this.postRepository.create(createPostDto);
    //add metaOptions to the post
    // if (metaOptions) {
    //   post.metaOptions = metaOptions;
    // }
    // //return the post
    return this.postRepository.save(post);
  }
  async findAll(userId: GetUsersParamDto) {
    const user = this.userService.findOneById(userId);
    let posts = await this.postRepository.find();
    return posts;
  }

  async delete(id: number) {
    await this.postRepository.delete(id);
    return { delete: true, id };
  }
}
