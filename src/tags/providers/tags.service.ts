/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';

import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { retry } from 'rxjs';
@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
  ) {}
  async create(createTagDto: CreateTagDto) {
    const tagg = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tagg);
  }
  async findMultipleTags(tags: number[]) {
    const result = await this.tagsRepository.find({ where: { id: In(tags) } });
    return result;
  }
  async delete(id: number) {
    await this.tagsRepository.delete(id);

    return { deleted: true, id };
  }

  async softDelete(id: number) {
    await this.tagsRepository.softDelete(id);
    return { softDelete: true, id };
  }
}
