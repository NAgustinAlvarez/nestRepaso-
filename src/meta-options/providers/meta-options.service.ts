/* eslint-disable prefer-const */
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-metadata.dto';
import { MetaOptions } from '../meta-option.entity';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOptions)
    private readonly metaOptionRepository: Repository<MetaOptions>,
  ) {}
  async createPostMetaOptions(createPostMetaOption: CreatePostMetaOptionsDto) {
    let metaOptions = this.metaOptionRepository.create(createPostMetaOption);
    return await this.metaOptionRepository.save(metaOptions);
  }
}
