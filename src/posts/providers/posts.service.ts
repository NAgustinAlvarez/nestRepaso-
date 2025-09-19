/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOptions } from 'src/meta-options/meta-option.entity';
import { UserService } from 'src/users/providers/users.service';
import { GetUsersParamDto } from 'src/users/dtos/get-user.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOptions)
    private readonly metaOptionRepository: Repository<MetaOptions>,
    private readonly userService: UserService,
    private readonly tagsService: TagsService,
  ) {}
  async create(createPostDto: CreatePostDto) {
    //find author
    let author = await this.userService.findOneById(createPostDto.authorId);
    if (!author) {
      throw new NotFoundException(
        `Usuario con ID ${createPostDto.authorId} no encontrado`,
      );
    }
    //find tags
    const tags = createPostDto.tags
      ? await this.tagsService.findMultipleTags(createPostDto.tags)
      : [];
    //create post
    let post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return this.postRepository.save(post);
  }
  async findAll(userId: number) {
    let posts = await this.postRepository.find({
      relations: { metaOptions: true },
    });
    return posts;
  }

  async delete(id: number) {
    await this.postRepository.delete(id);
    return { delete: true, id };
  }

  async update(patchPostDto: PatchPostDto) {
    //find the tags

    const tags = patchPostDto.tags
      ? await this.tagsService.findMultipleTags(patchPostDto.tags)
      : undefined;

    //find posts
    let post = await this.postRepository.findOne({
      where: { id: patchPostDto.id },
    });

    //update the post
    if (post) {
      post.title = patchPostDto.title ?? post.title;
      post.content = patchPostDto.content ?? post.content;
      post.status = patchPostDto.status ?? post.status;
      post.postType = patchPostDto.postType ?? post.postType;
      post.slug = patchPostDto.slug ?? post.slug;
      post.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
      post.publishOn = patchPostDto.publishOn ?? post.publishOn;
      //assign new tags
      post.tags = tags;
      //save the post and return
      return this.postRepository.save(post);
    }
    if (!post) {
      throw new NotFoundException(`Post with ID ${patchPostDto.id} not found`);
    }
  }
}
