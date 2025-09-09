import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreatePostMetaOptionsDto } from './dtos/create-post-metadata.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  postMetaOptions(@Body() metaOptions: CreatePostMetaOptionsDto) {
    return this.metaOptionsService.createPostMetaOptions(metaOptions);
  }
}
