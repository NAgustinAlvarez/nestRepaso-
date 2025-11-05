/* eslint-disable prefer-const */
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UserService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

import { FetchUserDto } from 'src/users/dtos/fetch-user.dto';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly userService: UserService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}
  async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author: FetchUserDto | null = null;
    let tags: Tag[] = [];

    try {
      //find author
      author = await this.userService.findOneById(user.sub);
      //find tags
      tags = createPostDto.tags
        ? await this.tagsService.findMultipleTags(createPostDto.tags)
        : [];
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags?.length !== tags.length) {
      throw new BadRequestException("Please check your tag Id's");
    }

    //create post
    let post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      return this.postRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }
  }
}
