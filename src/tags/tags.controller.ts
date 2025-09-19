/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async createTag(@Body() createTagDto: CreateTagDto) {
    return await this.tagsService.create(createTagDto);
  }

  @Delete()
  async delete(@Query('id', ParseIntPipe) id: number) {
    return await this.tagsService.delete(id);
  }

  @Delete('soft-delete')
  async softDelete(@Query('id', ParseIntPipe) id: number) {
    return await this.tagsService.softDelete(id);
  }
}
