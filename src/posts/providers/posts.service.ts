/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { MetaOptions } from 'src/meta-options/meta-option.entity';
import { UserService } from 'src/users/providers/users.service';
import { GetUsersParamDto } from 'src/users/dtos/get-user.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { DatabaseErrorService } from 'src/common/errors/error.service';
import { Tag } from 'src/tags/tag.entity';
import { GetPostDto } from '../dtos/get-post.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { User } from 'src/users/user.entity';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOptions)
    private readonly metaOptionRepository: Repository<MetaOptions>,
    private readonly userService: UserService,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
    private readonly cratePostProvider: CreatePostProvider,
  ) {}
  async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    await this.cratePostProvider.create(createPostDto, user);
  }
  async findAll(
    postQuery: GetPostDto,
    userId?: number,
  ): Promise<Paginated<Post>> {
    const post = await this.paginationProvider.paginatedQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postRepository,
    );
    return post;
  }

  async delete(id: number) {
    await this.postRepository.delete(id);
    return { delete: true, id };
  }

  async update(patchPostDto: PatchPostDto) {
    //find the tags
    //manejo de excepcion en servicio propio
    let tags: Tag[] | undefined;
    let post: Post | null;
    try {
      tags = patchPostDto.tags
        ? await this.tagsService.findMultipleTags(patchPostDto.tags)
        : undefined;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
      );
    }

    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please check you tag Ids and ensure they are correct',
      );
    }

    //find posts

    try {
      post = await this.postRepository.findOne({
        where: { id: patchPostDto.id },
      });
    } catch (error) {
      DatabaseErrorService.throwError('fetching post');
    }

    if (!post) {
      throw new NotFoundException(`Post with ID ${patchPostDto.id} not found`);
    }

    //update the post
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
    try {
      return this.postRepository.save(post);
    } catch (error) {
      DatabaseErrorService.saveError('Saving post');
    }
  }
}
